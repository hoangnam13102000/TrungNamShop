<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\MomoPayment;

class PaymentController extends Controller
{
    /* -----------------------------------------------------
            Create Momo Payment
    ------------------------------------------------------*/
    public function createMomoPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'error' => 'Order already paid',
                'message' => 'Đơn hàng này đã được thanh toán.'
            ], 400);
        }

        // MoMo Credentials
        $endpoint    = env('MOMO_ENDPOINT');
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey   = env('MOMO_ACCESS_KEY');
        $secretKey   = env('MOMO_SECRET_KEY');

        // URLs
        $redirectUrl = env('MOMO_RETURN_URL') . "?orderId={$order->id}";
        $ipnUrl      = env('MOMO_NOTIFY_URL');

        // Payment meta
        $orderId     = $order->id . '_' . time();
        $amount      = (int) round($order->final_amount);
        $requestId   = (string) time();
        $orderInfo   = "Thanh toan don hang #{$order->id}";
        $extraData   = "";

        // Signature
        $rawHash = "accessKey={$accessKey}&amount={$amount}&extraData={$extraData}"
            . "&ipnUrl={$ipnUrl}&orderId={$orderId}&orderInfo={$orderInfo}"
            . "&partnerCode={$partnerCode}&redirectUrl={$redirectUrl}"
            . "&requestId={$requestId}&requestType=captureWallet";

        $signature = hash_hmac('sha256', $rawHash, $secretKey);

        $payload = [
            'partnerCode' => $partnerCode,
            'accessKey'   => $accessKey,
            'requestId'   => $requestId,
            'amount'      => (string) $amount,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl'      => $ipnUrl,
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
            'signature'   => $signature
        ];

        Log::info('MoMo Request Payload', $payload);

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json']
        ]);

        $result = curl_exec($ch);

        if ($result === false) {
            $error = curl_error($ch);
            curl_close($ch);

            Log::error('MoMo CURL Error', ['error' => $error]);
            return response()->json([
                'error'   => 'CURL error',
                'message' => $error
            ], 500);
        }

        $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        Log::info('MoMo Response', ['status' => $responseCode, 'body' => $result]);

        $res = json_decode($result, true);

        if (!isset($res['payUrl'])) {
            return response()->json([
                'error' => 'MoMo server response invalid',
                'raw'   => $res
            ], 500);
        }

        // Save transaction record
        MomoPayment::create([
            'order_id'   => $order->id,
            'orderId'    => $orderId,
            'requestId'  => $requestId,
            'amount'     => $amount,
            'is_success' => false
        ]);

        return response()->json(['payment_url' => $res['payUrl']]);
    }

    /* -----------------------------------------------------
        Client Confirm Payment (Frontend sau redirect)
    ------------------------------------------------------*/
    public function clientConfirmPayment(Request $request)
    {
        $request->validate([
            'order_id'    => 'required|integer|exists:orders,id',
            'result_code' => 'required|string'
        ]);

        $orderId    = $request->order_id;
        $resultCode = intval($request->result_code);

        try {
            DB::beginTransaction();

            $order = Order::lockForUpdate()->find($orderId);

            if (!$order) {
                DB::rollBack();
                Log::warning('Client Confirm Failed: Order not found', ['order_id' => $orderId]);
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($resultCode === 0) {
                if ($order->payment_status !== 'paid') {
                    $order->payment_status = 'paid';

                    // ⭐⭐⭐ CHỈ SỬA ĐÚNG CHỖ NÀY ⭐⭐⭐
                    if ($order->delivery_method === 'pickup') {
                        $order->order_status = 'completed';
                    } else {
                        $order->order_status = 'pending';
                    }

                    $order->save();

                    Log::info('Client Confirm Success', [
                        'order_id' => $orderId,
                        'status'   => 'updated_to_paid'
                    ]);
                }

                DB::commit();
                return response()->json([
                    'message' => 'Payment confirmed and order updated successfully.',
                    'status'  => 'paid'
                ]);
            }

            if ($order->order_status === 'draft' || $order->payment_status === 'unpaid') {
                $order->payment_status = 'failed';
                $order->order_status   = 'canceled';
                $order->save();
            }

            DB::commit();

            Log::info('Client Confirm Received: Payment Failed/Canceled', [
                'order_id'    => $orderId,
                'result_code' => $resultCode,
                'new_status'  => $order->order_status
            ]);

            return response()->json([
                'message' => 'Payment failed or already processed.',
                'status'  => $order->order_status
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Client Confirm Error', [
                'order_id' => $orderId,
                'error'    => $e->getMessage()
            ]);

            return response()->json(['message' => 'Internal server error.'], 500);
        }
    }

    /* -----------------------------------------------------
        MoMo IPN Notify Callback
    ------------------------------------------------------*/
    public function momoNotify(Request $request)
    {
        $data = $request->all();

        $required = [
            'accessKey', 'amount', 'extraData', 'message', 'orderId',
            'orderInfo', 'orderType', 'partnerCode', 'payType',
            'requestId', 'responseTime', 'resultCode', 'transId', 'signature'
        ];

        foreach ($required as $key) {
            if (!isset($data[$key])) {
                Log::warning('MoMo notify missing key', ['missing' => $key]);
                return response()->json(['resultCode' => 0, 'message' => 'OK']);
            }
        }

        $rawHash =
            "accessKey={$data['accessKey']}&amount={$data['amount']}"
            . "&extraData={$data['extraData']}&message={$data['message']}"
            . "&orderId={$data['orderId']}&orderInfo={$data['orderInfo']}"
            . "&orderType={$data['orderType']}&partnerCode={$data['partnerCode']}"
            . "&payType={$data['payType']}&requestId={$data['requestId']}"
            . "&responseTime={$data['responseTime']}&resultCode={$data['resultCode']}"
            . "&transId={$data['transId']}";

        $isValid = hash_hmac('sha256', $rawHash, env('MOMO_SECRET_KEY')) === $data['signature'];

        Log::info('MoMo Notify', [
            'valid' => $isValid,
            'data'  => $data
        ]);

        $orderId = explode("_", $data['orderId'])[0];

        if ($isValid && intval($data['resultCode']) === 0) {
            try {
                DB::beginTransaction();

                $order = Order::lockForUpdate()->find($orderId);

                if ($order && $order->payment_status !== 'paid') {
                    $order->payment_status = 'paid';

                    // ⭐⭐⭐ CHỈ SỬA ĐÚNG CHỖ NÀY ⭐⭐⭐
                    if ($order->delivery_method === 'pickup') {
                        $order->order_status = 'completed';
                    } else {
                        $order->order_status = 'pending';
                    }

                    $order->save();

                    Log::info('MoMo IPN Success: Order updated to paid', [
                        'order_id' => $orderId
                    ]);
                }

                MomoPayment::where('orderId', $data['orderId'])
                    ->update(['is_success' => true]);

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('MoMo IPN Transaction Error', [
                    'order_id' => $orderId,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return response()->json(['resultCode' => 0, 'message' => 'OK']);
    }
}
