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
    public function index()
    {
        $orders = Order::with(['customer','employee','discount','store','details'])->get();
        return OrderResource::collection($orders);
    }

    public function show(string $id)
    {
        $order = Order::with(['customer','employee','discount','store','details'])->find($id);
        if (!$order) return response()->json(['message'=>'Order not found'],404);
        return new OrderResource($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_code'=>'required|string|max:50|unique:orders,order_code',
            'customer_id'=>'required|exists:customers,id',
            'employee_id'=>'nullable|exists:employees,id',
            'discount_id'=>'nullable|exists:discounts,id',
            'store_id'=>'nullable|exists:stores,id',
            'recipient_name'=>'required|string|max:191',
            'recipient_address'=>'required|string|max:255',
            'recipient_phone'=>'required|string|max:20',
            'note'=>'nullable|string',
            'delivery_method'=>'required|in:pickup,delivery',
            'payment_method'=>'required|in:cash,momo',
            'delivery_date'=>'nullable|date',
            'order_date'=>'nullable|date',
            'items'=>'required|array|min:1',
            'items.*.product_detail_id'=>'nullable|exists:product_details,id',
            'items.*.product_name'=>'required|string|max:191',
            'items.*.detail_info'=>'nullable|string|max:255',
            'items.*.quantity'=>'required|integer|min:1',
            'items.*.price_at_order'=>'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = collect($validated['items'])->sum(fn($item)=>$item['price_at_order']*$item['quantity']);
            $discountAmount = 0;
            if(!empty($validated['discount_id'])){
                $discount = Discount::find($validated['discount_id']);
                if($discount) $discountAmount = ($subtotal * min($discount->percentage,100))/100;
            }
            $finalAmount = $subtotal - $discountAmount;

            // Xác định trạng thái order
            $orderStatus = 'pending';
            $paymentStatus = 'unpaid';
            $paymentGateway = $validated['payment_method'] === 'momo' ? 'momo' : null;

            if($validated['delivery_method'] === 'pickup' && $validated['payment_method'] === 'cash'){
                $orderStatus = 'completed';
                $paymentStatus = 'paid';
            }

            $order = Order::create(array_merge($validated,[
                'final_amount'=>$finalAmount,
                'order_status'=>$orderStatus,
                'payment_status'=>$paymentStatus,
                'payment_gateway'=>$paymentGateway,
            ]));

            foreach($validated['items'] as $item){
                $order->details()->create([
                    'product_detail_id'=>$item['product_detail_id'] ?? null,
                    'product_name'=>$item['product_name'],
                    'detail_info'=>$item['detail_info'] ?? null,
                    'quantity'=>$item['quantity'],
                    'price_at_order'=>$item['price_at_order'],
                    'subtotal'=>$item['price_at_order']*$item['quantity'],
                ]);

                if(!empty($item['product_detail_id'])){
                    $productDetail = ProductDetail::find($item['product_detail_id']);
                    if($productDetail){
                        if($productDetail->stock_quantity < $item['quantity']){
                            throw new \Exception("Không đủ số lượng cho sản phẩm: ".$item['product_name']);
                        }
                        $productDetail->stock_quantity -= $item['quantity'];
                        $productDetail->save();
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message'=>'Đơn hàng tạo thành công',
                'order_id'=>$order->id,
                'order'=>new OrderResource($order->load('details','discount'))
            ],201);

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'message'=>'Tạo đơn hàng thất bại',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    public function update(Request $request,string $id)
    {
        $order = Order::find($id);
        if(!$order) return response()->json(['message'=>'Order not found'],404);

        $validated = $request->validate([
            'order_code'=>'required|string|max:50|unique:orders,order_code,'.$id,
            'customer_id'=>'required|exists:customers,id',
            'employee_id'=>'nullable|exists:employees,id',
            'discount_id'=>'nullable|exists:discounts,id',
            'store_id'=>'nullable|exists:stores,id',
            'recipient_name'=>'required|string|max:191',
            'recipient_address'=>'required|string|max:255',
            'recipient_phone'=>'required|string|max:20',
            'note'=>'nullable|string',
            'delivery_method'=>'required|in:pickup,delivery',
            'payment_method'=>'required|in:cash,momo',
            'delivery_date'=>'nullable|date',
            'order_date'=>'nullable|date',
        ]);

        $orderStatus = 'pending';
        $paymentStatus = 'unpaid';
        $paymentGateway = $validated['payment_method'] === 'momo' ? 'momo' : null;

        if($validated['delivery_method']==='pickup' && $validated['payment_method']==='cash'){
            $orderStatus = 'completed';
            $paymentStatus = 'paid';
        }

        $order->update(array_merge($validated,[
            'order_status'=>$orderStatus,
            'payment_status'=>$paymentStatus,
            'payment_gateway'=>$paymentGateway,
        ]));

        $subtotal = $order->details->sum(fn($d)=>$d->subtotal);
        $discountAmount = 0;
        if(!empty($order->discount_id)){
            $discount = Discount::find($order->discount_id);
            if($discount) $discountAmount = ($subtotal * min($discount->percentage,100))/100;
        }
        $order->final_amount = $subtotal - $discountAmount;
        $order->save();

        return new OrderResource($order->load('details','discount'));
    }

    public function destroy(string $id)
    {
        $order = Order::find($id);
        if(!$order) return response()->json(['message'=>'Order not found'],404);
        $order->delete();
        return response()->json(['message'=>'Order deleted successfully!']);
    }
}
