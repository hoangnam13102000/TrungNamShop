<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\MomoPayment;

class PaymentController extends Controller
{
    // ---------------- MoMo ----------------
    public function createMomoPayment(Request $request)
    {
        $request->validate(['order_id' => 'required|integer|exists:orders,id']);
        $order = Order::findOrFail($request->order_id);

        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');
        $redirectUrl = env('MOMO_RETURN_URL');
        $ipnUrl = env('MOMO_NOTIFY_URL');

        $orderId = $order->id . '_' . time();
        $amount = (int) round($order->final_amount);
        $requestId = (string) time();
        $orderInfo = "Thanh toan don hang #" . $order->id;
        $extraData = "";

        $rawHashManual = 
            "accessKey={$accessKey}&amount={$amount}&extraData={$extraData}" .
            "&ipnUrl={$ipnUrl}&orderId={$orderId}&orderInfo={$orderInfo}" .
            "&partnerCode={$partnerCode}&redirectUrl={$redirectUrl}&requestId={$requestId}&requestType=captureWallet";

        $signature = hash_hmac('sha256', $rawHashManual, $secretKey);

        $payload = [
            'partnerCode' => $partnerCode,
            'accessKey'   => $accessKey,
            'requestId'   => $requestId,
            'amount'      => (string)$amount,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl'      => $ipnUrl,
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
            'signature'   => $signature
        ];

        Log::info('MoMo Request Payload', ['payload' => $payload]);

        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $result = curl_exec($ch);

        if ($result === false) {
            $curlErr = curl_error($ch);
            curl_close($ch);
            Log::error('MoMo CURL error', ['error' => $curlErr]);
            return response()->json(['error' => 'CURL error', 'message' => $curlErr], 500);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        Log::info('MoMo Response', ['http_code' => $httpCode, 'body' => $result]);

        $res = json_decode($result, true);

        if (!is_array($res) || !isset($res['payUrl'])) {
            return response()->json(['error' => 'MoMo server response invalid', 'raw' => $res], 500);
        }

        MomoPayment::create([
            'order_id'  => $order->id,
            'orderId'   => $orderId,
            'requestId' => $requestId,
            'amount'    => $amount,
            'is_success'=> false
        ]);

        return response()->json(['payment_url' => $res['payUrl']]);
    }

    // ---------------- MoMo Notify Callback ----------------
    public function momoNotify(Request $request)
    {
        $data = $request->all();

        $required = ['accessKey','amount','extraData','message','orderId','orderInfo','orderType','partnerCode','payType','requestId','responseTime','resultCode','transId','signature'];
        foreach ($required as $k) {
            if (!array_key_exists($k, $data)) {
                Log::warning('MoMo notify missing key', ['missing' => $k, 'data' => $data]);
                return response()->json(['resultCode'=>0,'message'=>'OK']);
            }
        }

        $rawHash =
            "accessKey=" . $data['accessKey'] .
            "&amount=" . $data['amount'] .
            "&extraData=" . $data['extraData'] .
            "&message=" . $data['message'] .
            "&orderId=" . $data['orderId'] .
            "&orderInfo=" . $data['orderInfo'] .
            "&orderType=" . $data['orderType'] .
            "&partnerCode=" . $data['partnerCode'] .
            "&payType=" . $data['payType'] .
            "&requestId=" . $data['requestId'] .
            "&responseTime=" . $data['responseTime'] .
            "&resultCode=" . $data['resultCode'] .
            "&transId=" . $data['transId'];

        $expectedSignature = hash_hmac('sha256', $rawHash, env('MOMO_SECRET_KEY'));
        $isValid = $expectedSignature === $data['signature'];

        Log::info('MoMo Notify', ['data' => $data, 'valid' => $isValid]);

        $orderId = explode("_", $data['orderId'])[0];

        if ($isValid && intval($data['resultCode']) === 0) {
            $order = Order::find($orderId);
            if ($order) {
                $order->payment_status = 'paid';
                $order->order_status = 'completed';
                $order->save();
            }

            MomoPayment::where('orderId', $data['orderId'])
                ->update(['is_success' => true]);
        }

        return response()->json(["resultCode" => 0, "message" => "OK"]);
    }
}
