<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;
use App\Http\Resources\OrderDetailResource;
use Illuminate\Http\Response;

class OrderDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = OrderDetail::with([
            'productDetail.memory',        // load memory để lấy ram
            'productDetail.product.images' // load images
        ])->get();

        return OrderDetailResource::collection($details);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'product_name' => 'required|string|max:255',
            'detail_info' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price_at_order' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $detail = OrderDetail::create($data);

        return new OrderDetailResource($detail);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderDetail $orderDetail)
    {
        $orderDetail->load([
            'productDetail.memory',
            'productDetail.product.images'
        ]);

        return new OrderDetailResource($orderDetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrderDetail $orderDetail)
    {
        $data = $request->validate([
            'order_id' => 'sometimes|required|exists:orders,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'product_name' => 'sometimes|required|string|max:255',
            'detail_info' => 'nullable|string|max:255',
            'quantity' => 'sometimes|required|integer|min:1',
            'price_at_order' => 'sometimes|required|numeric|min:0',
            'subtotal' => 'sometimes|required|numeric|min:0',
        ]);

        $orderDetail->update($data);

        $orderDetail->load([
            'productDetail.memory',
            'productDetail.product.images'
        ]);

        return new OrderDetailResource($orderDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderDetail $orderDetail)
    {
        $orderDetail->delete();
        return response()->json(['message' => 'Order detail đã được xóa'], Response::HTTP_OK);
    }
}
