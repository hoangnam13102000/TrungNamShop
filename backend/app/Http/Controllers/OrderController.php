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
            'payment_method' => 'required|in:cash,paypal,bank_transfer,momo',
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
        ]);

        $order = Order::create($validated);

        return new OrderResource($order);
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
            'payment_method' => 'required|in:cash,paypal,bank_transfer,momo',
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
        ]);

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

    /**
     * Display soft-deleted orders.
     */
    // public function trashed()
    // {
    //     $trashed = Order::onlyTrashed()->with(['customer', 'employee', 'discount', 'store'])->get();
    //     return OrderResource::collection($trashed);
    // }

    // /**
    //  * Restore a soft-deleted order.
    //  */
    // public function restore(string $id)
    // {
    //     $order = Order::onlyTrashed()->find($id);

    //     if (!$order) {
    //         return response()->json(['message' => 'Order not found in trash'], 404);
    //     }

    //     $order->restore();

    //     return new OrderResource($order);
    // }

    // /**
    //  * Permanently delete a soft-deleted order.
    //  */
    // public function forceDelete(string $id)
    // {
    //     $order = Order::onlyTrashed()->find($id);

    //     if (!$order) {
    //         return response()->json(['message' => 'Order not found in trash'], 404);
    //     }

    //     $order->forceDelete();

    //     return response()->json(['message' => 'Order permanently deleted!']);
    // }
}
