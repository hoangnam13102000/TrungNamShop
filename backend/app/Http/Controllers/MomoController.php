<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\MomoService;

class MomoController extends Controller
{
    protected MomoService $momoService;

    public function __construct(MomoService $momoService)
    {
        $this->momoService = $momoService;
    }

    /* ============================================================================
        1. Create MoMo Payment → Frontend nhận URL redirect
    ============================================================================ */
    public function createMomoPayment(Request $request)
    {
        $request->validate(['order_id' => 'required|integer|exists:orders,id']);

        $order = Order::findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'error'   => 'Order already paid',
                'message' => 'Đơn hàng này đã thanh toán trước đó.'
            ], 400);
        }

        $paymentUrl = $this->momoService->createPayment($order);

        return response()->json(['payment_url' => $paymentUrl]);
    }


    /* ============================================================================
        2. Xác nhận trạng thái thanh toán (sau redirect từ MoMo về client)
    ============================================================================ */
    public function clientConfirmPayment(Request $request)
    {
        $request->validate([
            'order_id'    => 'required|integer|exists:orders,id',
            'result_code' => 'required'
        ]);

        $order = Order::findOrFail($request->order_id);

        $status = $this->momoService->confirmClient($order, intval($request->result_code));

        return response()->json([
            'message' => $status ? 'Thanh toán thành công.' : 'Thanh toán thất bại!',
            'status'  => $status ? 'paid' : 'failed'
        ]);
    }


    /* ============================================================================
        3. MoMo IPN Webhook – Server xác nhận giao dịch tự động
    ============================================================================ */
    public function momoNotify(Request $request)
    {
        $result = $this->momoService->handleIpn($request->all());

        if ($result) {
            Log::info("MoMo IPN SUCCESS");
        } else {
            Log::warning("MoMo IPN FAILED");
        }

        // MoMo yêu cầu luôn trả code 0 tránh spam IPN liên tục
        return response()->json(['resultCode' => 0, 'message' => 'OK']);
    }
}
