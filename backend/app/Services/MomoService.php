<?php

namespace App\Services;

use App\Models\Order;
use App\Models\MomoPayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MomoService
{
    /* ========== 1. Tạo thanh toán ========== */
    public function createPayment(Order $order)
    {
        $endpoint    = env('MOMO_ENDPOINT');
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey   = env('MOMO_ACCESS_KEY');
        $secretKey   = env('MOMO_SECRET_KEY');

        $redirectUrl = env('MOMO_RETURN_URL') . "?orderId={$order->id}";
        $ipnUrl      = env('MOMO_NOTIFY_URL');

        $orderId   = $order->id . '_' . time();
        $amount    = (int) round($order->final_amount);
        $requestId = (string) time();
        $orderInfo = "Thanh toán đơn hàng #{$order->id}";
        $extraData = "";

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

        $result = $this->sendRequest($endpoint, $payload);
        $res    = json_decode($result, true);

        if (!isset($res['payUrl'])) {
            Log::error("MoMo Response invalid", $res);
            throw new \Exception("MoMo không trả về payUrl");
        }

        MomoPayment::create([
            'order_id'   => $order->id,
            'orderId'    => $orderId,
            'requestId'  => $requestId,
            'amount'     => $amount,
            'is_success' => false
        ]);

        return $res['payUrl'];
    }


    /* ========== 2. Xác nhận kết quả từ Client ========== */
    public function confirmClient(Order $order, int $resultCode)
    {
        DB::beginTransaction();

        try {
            if ($resultCode === 0 && $order->payment_status !== 'paid') {
                $order->payment_status = 'paid';
                $order->order_status   = $order->delivery_method === 'pickup' ? 'completed' : 'pending';
                $order->save();
                DB::commit();
                return true;
            }

            $order->payment_status = 'failed';
            $order->order_status   = 'canceled';
            $order->save();

            DB::commit();
            return false;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("MoMo Client Confirm Error", ['error'=>$e->getMessage()]);
            return false;
        }
    }


    /* ========== 3. IPN từ MoMo gửi về Server Backend ========== */
    public function handleIpn(array $data)
    {
        $rawHash =
            "accessKey={$data['accessKey']}&amount={$data['amount']}"
            . "&extraData={$data['extraData']}&message={$data['message']}"
            . "&orderId={$data['orderId']}&orderInfo={$data['orderInfo']}"
            . "&orderType={$data['orderType']}&partnerCode={$data['partnerCode']}"
            . "&payType={$data['payType']}&requestId={$data['requestId']}"
            . "&responseTime={$data['responseTime']}&resultCode={$data['resultCode']}"
            . "&transId={$data['transId']}";

        $isValid = hash_hmac('sha256', $rawHash, env('MOMO_SECRET_KEY')) === $data['signature'];

        if (!$isValid) return false;

        $orderId = explode("_",$data['orderId'])[0];

        if ($isValid && intval($data['resultCode']) === 0) {
            return $this->markOrderAsPaid($orderId, $data['orderId']);
        }

        return false;
    }


    private function markOrderAsPaid($orderId, $momoOrderId)
    {
        try {
            DB::beginTransaction();

            $order = Order::lockForUpdate()->find($orderId);

            if ($order && $order->payment_status !== 'paid') {
                $order->payment_status = 'paid';
                $order->order_status   = $order->delivery_method === 'pickup' ? 'completed' : 'pending';
                $order->save();
            }

            MomoPayment::where("orderId",$momoOrderId)->update(['is_success'=>true]);
            DB::commit();
            return true;

        } catch(\Exception $e){
            DB::rollBack();
            Log::error("MoMo IPN error", ['error'=>$e->getMessage()]);
            return false;
        }
    }


    private function sendRequest($url, $payload)
    {
        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json']
        ]);

        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}
