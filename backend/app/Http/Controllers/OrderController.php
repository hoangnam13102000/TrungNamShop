<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Discount;
use App\Models\ProductDetail;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\DB; 

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['customer', 'employee', 'discount', 'store', 'details'])->get();
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
            // CHỈ CHO PHÉP 'cash' HOẶC 'momo'
            'payment_method' => 'required|in:cash,momo', 
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_detail_id' => 'nullable|exists:product_details,id',
            'items.*.product_name' => 'required|string|max:191',
            'items.*.detail_info' => 'nullable|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price_at_order' => 'required|numeric|min:0',
        ]);

        
        DB::beginTransaction();

        try {
            // Tính subtotal từ items
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['price_at_order'] * $item['quantity'];
            });

            // Tính giảm giá nếu có
            $discountAmount = 0;
            if (!empty($validated['discount_id'])) {
                $discount = Discount::find($validated['discount_id']);
                if ($discount) {
                    // Kiểm tra và đảm bảo percentage hợp lệ
                    $percentage = $discount->percentage > 100 ? 100 : $discount->percentage;
                    $discountAmount = ($subtotal * $percentage) / 100;
                }
            }

            $finalAmount = $subtotal - $discountAmount;
            
            
            if ($validated['payment_method'] === 'momo') {
                 $validated['payment_gateway'] = 'momo';
                 
            } else {
               
                 $validated['payment_gateway'] = null;
                 $validated['transaction_id'] = null;
                 $validated['payment_response'] = null;
            }


           
            $order = Order::create(array_merge($validated, [
                'final_amount' => $finalAmount,
            ]));

            // Tạo OrderDetails và trừ stock
            foreach ($validated['items'] as $item) {
                $order->details()->create([
                    'product_detail_id' => $item['product_detail_id'] ?? null,
                    'product_name' => $item['product_name'],
                    'detail_info' => $item['detail_info'] ?? null,
                    'quantity' => $item['quantity'],
                    'price_at_order' => $item['price_at_order'],
                    'subtotal' => $item['price_at_order'] * $item['quantity'],
                ]);

                // Trừ stock nếu product_detail_id tồn tại
                if (!empty($item['product_detail_id'])) {
                    $productDetail = ProductDetail::find($item['product_detail_id']);
                    if ($productDetail) {
                        // Kiểm tra đủ hàng trước khi trừ
                        if ($productDetail->stock_quantity < $item['quantity']) {
                             // Ném exception để rollback transaction nếu không đủ hàng
                            throw new \Exception("Không đủ số lượng cho sản phẩm: " . $item['product_name']); 
                        }
                        $productDetail->stock_quantity -= $item['quantity'];
                        $productDetail->save();
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Đơn hàng tạo thành công',
                'order_id' => $order->id,
                'order' => new OrderResource($order->load('details', 'discount'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Tạo đơn hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['customer', 'employee', 'discount', 'store', 'details'])->find($id);

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
            'payment_method' => 'required|in:cash,momo', 
            'delivery_date' => 'nullable|date',
            'order_date' => 'nullable|date',
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'order_status' => 'required|in:pending,processing,shipping,completed,cancelled',
        ]);
        
        
        if ($validated['payment_method'] === 'momo') {
             $validated['payment_gateway'] = 'momo';
           
        } else {
            
             $validated['payment_gateway'] = null;
             $validated['transaction_id'] = null;
             $validated['payment_response'] = null;
        }

        $order->update($validated);

        // Tính lại final_amount nếu discount thay đổi
        $subtotal = $order->details->sum(function ($detail) {
            return $detail->subtotal;
        });

        $discountAmount = 0;
        if (!empty($order->discount_id)) {
            $discount = Discount::find($order->discount_id);
            if ($discount) {
                $percentage = $discount->percentage > 100 ? 100 : $discount->percentage;
                $discountAmount = ($subtotal * $percentage) / 100;
            }
        }

        $order->final_amount = $subtotal - $discountAmount;
        $order->save();

        return new OrderResource($order->load('details', 'discount'));
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