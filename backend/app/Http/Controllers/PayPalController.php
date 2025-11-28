<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\PaypalPayment;
use App\Services\PayPalService;

class PaypalController extends Controller
{
    protected PayPalService $paypalService;

    public function createPaypalPayment(Request $request)
    {
        $request->validate(['order_id'=>'required|integer|exists:orders,id']);
        $order = Order::findOrFail($request->order_id);

        if($order->payment_status=='paid') return response()->json(['error'=>'Order already paid'],400);

        try{
            $service = app(PayPalService::class);
            $referenceId="ORDER_$order->id";
            $paypal = $service->createOrder($order->final_amount,$order->id,$referenceId);

            PaypalPayment::create([
                'order_id'=>$order->id,'payment_id'=>$paypal['id'],
                'amount'=>$order->final_amount,'is_success'=>false,'status'=>$paypal['status'] ?? 'CREATED'
            ]);

            return response()->json(['payment_url'=>$paypal['approval_url'] ?? null]);

        }catch(\Exception $e){
            Log::error("PayPal create error:".$e->getMessage());
            return response()->json(['error'=>'PayPal create failed'],500);
        }
    }

    public function paypalSuccess(Request $request)
    {
        $token=$request->token;

        try{
            $service=app(PayPalService::class);
            $result=$service->captureOrder($token);

            PaypalPayment::where('payment_id',$token)->update([
                'is_success'=>true,'status'=>$result['status'] ?? 'COMPLETED'
            ]);

            $ref = $result['purchase_units'][0]['reference_id'] ?? '';
            $orderId = str_replace('ORDER_','',$ref);

            if($orderId){
                DB::transaction(function()use($orderId){
                    $order = Order::lockForUpdate()->find($orderId);
                    if($order && $order->payment_status!='paid'){
                        $order->update(['payment_status'=>'paid','order_status'=>$order->delivery_method=='pickup'?'completed':'pending']);
                    }
                });
            }

            return redirect(env('PAYPAL_FRONTEND_URL')."/paypal-result?status=success&token=$token");

        }catch(\Exception $e){
            return redirect(env('PAYPAL_FRONTEND_URL')."/paypal-result?status=failed&token=$token");
        }
    }

    public function paypalCancel(Request $request)
    {
        return redirect(env('PAYPAL_FRONTEND_URL')."/payment-result?status=canceled&token=".$request->token);
    }

    public function orderByPaypal($token)
    {
        $p=PaypalPayment::with('order')->where('payment_id',$token)->first();
        if(!$p) return response()->json(['error'=>'Order not found'],404);

        return response()->json([
            'order_id'=>$p->order->id,'payment_status'=>$p->order->payment_status,
            'order_status'=>$p->order->order_status,'paypal_status'=>$p->status,
            'amount'=>$p->amount,'is_success'=>$p->is_success
        ]);
    }
}
