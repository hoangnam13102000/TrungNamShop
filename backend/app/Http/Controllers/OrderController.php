<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['customer', 'employee', 'discount', 'store'])->get();
        return OrderResource::collection($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate dữ liệu
        $validated = $request->validate([
            'order_code' => 'required|string|max:50|unique:orders,order_code',
            'customer_id' => 'required|exists:customers,id',
            'employee_id' => 'nullable|exists:employees,id',
            'discount_id' => 'nullable|exists:discounts,id',
            'store_id' => 'nullable|exists:stores,id',
            'recipient_name' => 'required|string|max:191',
            'recipient_address' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'note' => 'nullable|string',
            'delivery_method' => 'required|in:pickup,delivery',
            'payment_method' => 'required|in:cash,paypal,bank_transfer,momo,vnpay',
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
            'final_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_detail_id' => 'nullable|exists:product_details,id',
            'items.*.product_name' => 'required|string|max:191',
            'items.*.detail_info' => 'nullable|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price_at_order' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        // Nếu là thanh toán VNPay, lưu payment_gateway
        if ($validated['payment_method'] === 'vnpay') {
            $validated['payment_gateway'] = 'vnpay';
        }

        // Tạo Order
        $order = Order::create($validated);

        // Tạo OrderDetails
        foreach ($validated['items'] as $item) {
            $order->details()->create([
                'product_detail_id' => $item['product_detail_id'] ?? null,
                'product_name' => $item['product_name'],
                'detail_info' => $item['detail_info'] ?? null,
                'quantity' => $item['quantity'],
                'price_at_order' => $item['price_at_order'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        return response()->json([
            'message' => 'Đơn hàng tạo thành công',
            'order' => $order->load('details')
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['customer', 'employee', 'discount', 'store'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return new OrderResource($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'order_code' => 'required|string|max:50|unique:orders,order_code,' . $id,
            'customer_id' => 'required|exists:customers,id',
            'employee_id' => 'nullable|exists:employees,id',
            'discount_id' => 'nullable|exists:discounts,id',
            'store_id' => 'nullable|exists:stores,id',
            'recipient_name' => 'required|string|max:191',
            'recipient_address' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'note' => 'nullable|string',
            'delivery_method' => 'required|in:pickup,delivery',
            'payment_method' => 'required|in:cash,paypal,bank_transfer,momo,vnpay',
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
        ]);

        // Nếu thanh toán VNPay, lưu payment_gateway
        if ($validated['payment_method'] === 'vnpay') {
            $validated['payment_gateway'] = 'vnpay';
        }

        $order->update($validated);

        return new OrderResource($order);
    }

    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully!']);
    }
}
