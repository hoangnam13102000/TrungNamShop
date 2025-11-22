<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use App\Models\ProductDetail; // Import ProductDetail Model
use Illuminate\Http\Request;
use App\Http\Resources\OrderDetailResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB; // Import DB facade cho Transaction
use Illuminate\Support\Facades\Log; // *** ĐÃ THÊM DÒNG NÀY ***
use Exception; // Import Exception

class OrderDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = OrderDetail::with([
            'productDetail.memory',      // load memory để lấy ram
            'productDetail.product.images' // load images
        ])->get();

        return OrderDetailResource::collection($details);
    }

    /**
     * Store a newly created resource in storage.
     * Cập nhật: Thêm logic trừ tồn kho.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            // product_detail_id là bắt buộc nếu muốn trừ kho, vì tên cột là product_detail_id
            'product_detail_id' => 'required|exists:product_details,id',
            'product_name' => 'required|string|max:255',
            'detail_info' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price_at_order' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $quantity = $data['quantity'];
        $productDetailId = $data['product_detail_id'];

        DB::beginTransaction();

        try {
            // 1. Tìm Product Detail và trừ kho
            $productDetail = ProductDetail::lockForUpdate()->find($productDetailId); // Lock row để tránh race condition

            if (!$productDetail) {
                throw new Exception("Sản phẩm chi tiết không tồn tại.");
            }
            
            // Hàm decreaseStock sẽ tự động kiểm tra tồn kho và throw Exception nếu không đủ.
            $productDetail->decreaseStock($quantity);

            // 2. Tạo Order Detail
            $detail = OrderDetail::create($data);

            DB::commit();

            return new OrderDetailResource($detail);

        } catch (Exception $e) {
            DB::rollback();
            // *** ĐÃ THÊM DÒNG NÀY ĐỂ DEBUG LỖI TRỪ KHO ***
            // Khi chạy API này, bạn sẽ thấy thông báo lỗi chi tiết thay vì lỗi 400 chung chung.
            // Sau khi debug xong, bạn nên xóa dòng dd() này đi.
            // dd($e->getMessage()); 
            
            // Trả về lỗi 400 hoặc 500 tùy thuộc vào loại lỗi
            return response()->json([
                'message' => 'Lỗi khi tạo chi tiết đơn hàng hoặc trừ tồn kho.',
                'error' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
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
     * Lưu ý: Cập nhật chi tiết đơn hàng liên quan đến việc trừ/hoàn trả tồn kho phức tạp.
     * Cần tính toán sự khác biệt giữa quantity cũ và mới.
     */
    public function update(Request $request, OrderDetail $orderDetail)
    {
        $data = $request->validate([
            'order_id' => 'sometimes|required|exists:orders,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'product_name' => 'sometimes|required|string|max:255',
            'detail_info' => 'nullable|string|max:255',
            'quantity' => 'sometimes|required|integer|min:1', // Có thể thay đổi
            'price_at_order' => 'sometimes|required|numeric|min:0',
            'subtotal' => 'sometimes|required|numeric|min:0',
        ]);

        // Chỉ xử lý logic tồn kho nếu cột 'quantity' bị thay đổi
        if (isset($data['quantity']) && $data['quantity'] != $orderDetail->quantity) {
            $oldQuantity = $orderDetail->quantity;
            $newQuantity = $data['quantity'];
            $productDetailId = $orderDetail->product_detail_id;

            DB::beginTransaction();
            try {
                $productDetail = ProductDetail::lockForUpdate()->find($productDetailId);

                if (!$productDetail) {
                    throw new Exception("Sản phẩm chi tiết không tồn tại.");
                }

                $quantityDifference = $newQuantity - $oldQuantity;

                if ($quantityDifference > 0) {
                    // Tăng số lượng: Cần trừ thêm vào tồn kho
                    $productDetail->decreaseStock($quantityDifference);
                } elseif ($quantityDifference < 0) {
                    // Giảm số lượng: Cần hoàn trả vào tồn kho
                    $productDetail->increaseStock(abs($quantityDifference));
                }

                $orderDetail->update($data);

                DB::commit();

            } catch (Exception $e) {
                DB::rollback();
                return response()->json([
                    'message' => 'Lỗi khi cập nhật chi tiết đơn hàng hoặc tồn kho.',
                    'error' => $e->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        } else {
            // Nếu không thay đổi quantity, chỉ cập nhật các trường khác
            $orderDetail->update($data);
        }

        $orderDetail->load([
            'productDetail.memory',
            'productDetail.product.images'
        ]);

        return new OrderDetailResource($orderDetail);
    }

    /**
     * Remove the specified resource from storage.
     * Cập nhật: Thêm logic hoàn trả tồn kho.
     */
    public function destroy(OrderDetail $orderDetail)
    {
        $quantity = $orderDetail->quantity;
        $productDetailId = $orderDetail->product_detail_id;

        DB::beginTransaction();

        try {
            // 1. Hoàn trả tồn kho
            $productDetail = ProductDetail::lockForUpdate()->find($productDetailId);

            if (!$productDetail) {
                // Nếu không tìm thấy sản phẩm chi tiết, vẫn xóa OrderDetail nhưng log lỗi
                Log::warning("ProductDetail #{$productDetailId} không tìm thấy khi xóa OrderDetail #{$orderDetail->id}. Không thể hoàn trả tồn kho.");
            } else {
                $productDetail->increaseStock($quantity);
            }
            
            // 2. Xóa Order Detail
            $orderDetail->delete();

            DB::commit();
            return response()->json(['message' => 'Order detail đã được xóa và tồn kho đã được hoàn trả'], Response::HTTP_OK);

        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Lỗi khi xóa chi tiết đơn hàng hoặc hoàn trả tồn kho.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}