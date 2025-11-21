<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GeminiService;
use RuntimeException;

use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Discount; 
use App\Models\Promotion; 
use Illuminate\Database\Eloquent\Collection;

class ChatbotController extends Controller
{
    protected GeminiService $gemini;
    protected string $systemPrompt;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;

        // System Prompt for AI
        $this->systemPrompt =
            "Bạn là chatbot tư vấn bán hàng của website. 
            Khi trả lời, chỉ dựa trên dữ liệu sản phẩm tôi cung cấp từ database.
            Tránh đưa ra thông tin không có trong dữ liệu (ví dụ: không gợi ý mã giảm giá nếu không có mã nào được liệt kê).
            Trả lời ngắn gọn, gợi ý đúng nhu cầu khách hàng.";
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
        ]);

        $userMessage = $request->message;

        // ============================
        // 1 USER KEYWORD ANALYSIS
        // ============================
        $brandId = $this->detectBrand($userMessage);
        $priceRange = $this->detectPriceRange($userMessage);

        // 1.5 NEW KEYWORD ANALYSIS (Payment, Discount, Promotion)
        $isDiscountQuery = $this->detectDiscountQuery($userMessage);
        $isPromotionQuery = $this->detectPromotionQuery($userMessage);
        $isPaymentQuery = $this->detectPaymentQuery($userMessage);

        // ============================
        // 2 QUERY DATABASE
        // ============================
        
        // Truy vấn giảm giá/khuyến mãi chỉ 1 lần
        // LƯU Ý: searchActivePromotions() hiện đang chỉ lọc theo status='active' (tạm thời bỏ qua ngày tháng)
        $activeDiscounts = $this->searchActiveDiscounts();
        $activePromotions = $this->searchActivePromotions();
        
        // Eager load promotion CÓ ĐIỀU KIỆN 
        $products = $this->searchProducts($brandId, $priceRange);

        // Dữ liệu sản phẩm đã được tính giá chính xác
        $productListText = $this->formatProductsForAI($products);

        // 2.5 NEW QUERY DATABASE (Discount, Promotion, Payment)
        $discountListText = $isDiscountQuery ? $this->formatDiscountsForAI($activeDiscounts) : "";
        $promotionListText = $isPromotionQuery ? $this->formatPromotionsForAI($activePromotions) : "";
        $paymentMethodsText = $isPaymentQuery ? $this->formatPaymentMethodsForAI($this->getPaymentMethods()) : "";

        // ============================
        // 3 BUILD PROMPT GỬI CHO AI
        // ============================
        $fullPrompt =
            $this->systemPrompt .
            "\n\n--- Dữ liệu từ Database ---" .
            "\n\nDữ liệu sản phẩm lấy từ database:\n" .
            ($productListText ?: "Không tìm thấy sản phẩm phù hợp.") .
            ($discountListText ? "\n\nMã giảm giá đang hoạt động:\n" . $discountListText : "") .
            ($promotionListText ? "\n\nChương trình khuyến mãi đang hoạt động:\n" . $promotionListText : "") .
            ($paymentMethodsText ? "\n\nPhương thức thanh toán được hỗ trợ:\n" . $paymentMethodsText : "") .
            "\n\n--- Hết Dữ liệu ---\n" .
            "\n\nCâu hỏi từ khách hàng: " . $userMessage .
            "\n\nHãy tư vấn dựa trên dữ liệu trên.";

        // ============================
        // 4 GEMINI CONVERSATION
        // ============================
        $conversation = [
            ['role' => 'user', 'content' => $fullPrompt]
        ];

        try {
            $reply = $this->gemini->chat($conversation);
        } catch (RuntimeException $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Lỗi AI: ' . $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'ok' => true,
            'assistant' => $reply,
            'products' => $products, // trả về JSON sản phẩm cho front-end hiển thị
        ]);
    }

    // ===========================================
    //          PROCESSING LOGIC SECTION
    // ===========================================

    private function detectBrand(string $message)
    {
        $brands = Brand::all();
        $message = strtolower($message);

        foreach ($brands as $b) {
            if (str_contains($message, strtolower($b->name))) {
                return $b->id;
            }
        }
        return null;
    }

    private function detectPriceRange(string $message)
    {
        if (preg_match('/(\d+)\s?tr/i', $message, $m)) {
            $value = (int)$m[1];
            return [
                'min' => max(0, ($value - 2) * 1_000_000),
                'max' => ($value + 2) * 1_000_000,
            ];
        }
        return null;
    }

    private function detectDiscountQuery(string $message): bool
    {
        $keywords = ['giảm giá', 'mã khuyến mãi', 'coupon', 'voucher'];
        $message = strtolower($message);
        foreach ($keywords as $keyword) {
            if (str_contains($message, $keyword)) return true;
        }
        return false;
    }

    private function detectPromotionQuery(string $message): bool
    {
        $keywords = ['khuyến mãi', 'ưu đãi', 'chương trình', 'có sale'];
        $message = strtolower($message);
        foreach ($keywords as $keyword) {
            if (str_contains($message, $keyword)) return true;
        }
        return false;
    }

    private function detectPaymentQuery(string $message): bool
    {
        $keywords = ['thanh toán', 'trả tiền', 'momo', 'vnpay', 'cách mua'];
        $message = strtolower($message);
        foreach ($keywords as $keyword) {
            if (str_contains($message, $keyword)) return true;
        }
        return false;
    }

    private function searchProducts($brandId, $priceRange)
    {
        $query = ProductDetail::with([
            'product.brand',
            // Eager load promotion CÓ ĐIỀU KIỆN 
            // TẠM THỜI: Chỉ lọc theo status 'active' để hiển thị dữ liệu khi test, bỏ qua điều kiện ngày tháng.
            'promotion' => function ($q) {
                $q->where('status', 'active'); 
                // Dùng cho PRODUCTION: $q->where('start_date', '<=', now())->where('end_date', '>=', now());
            },
            'images' => fn($q) => $q->where('is_primary', true)
        ]);

        if ($brandId) {
            $query->whereHas('product', fn($q) => $q->where('brand_id', $brandId));
        }

        if ($priceRange) {
            $query->whereBetween('price', [$priceRange['min'], $priceRange['max']]);
        }

        // Lấy 10 sản phẩm
        return $query->limit(10)->get();
    }

    private function searchActiveDiscounts()
    {
        // Lấy tất cả mã giảm giá đang hoạt động (dùng cho mục đích thông báo chung)
        // Giữ nguyên logic lọc ngày cho Discounts vì Discounts thường ngắn hạn và cần chính xác.
        return Discount::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
    }

    private function searchActivePromotions()
    {
        // Lấy tất cả chương trình khuyến mãi đang hoạt động (dùng cho mục đích thông báo chung)
        
        // **TẠM THỜI:** Chỉ lọc theo status 'active' để hiển thị dữ liệu đã hết hạn khi bạn test.
        // **KHUYẾN CÁO SỬ DỤNG TRONG PRODUCTION:**
        /*
        return Promotion::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
        */
        
        // MÃ HIỆN TẠI DÙNG CHO MỤC ĐÍCH TEST:
        return Promotion::where('status', 'active')->get();
    }

    private function getPaymentMethods()
    {
        return [
            'Thanh toán khi nhận hàng (COD/Cash)',
            'Thẻ tín dụng/ghi nợ (PayPal)',
            'Chuyển khoản ngân hàng (Bank Transfer)',
            'Ví điện tử MoMo',
            'Ví điện tử VNPAY',
        ];
    }

    // ===========================================
    //          FORMATTING LOGIC SECTION
    // ===========================================

    /**
     * Tính toán giá sản phẩm chính xác dựa trên promotion đang được áp dụng trực tiếp lên ProductDetail,
     * sử dụng đúng trường 'discount_percent' và 'name' của Promotion.
     */
    private function formatProductsForAI(Collection $products)
    {
        if ($products->isEmpty()) return "";

        $text = "";

        foreach ($products as $p) {
            $originalPrice = $p->price;
            $finalPrice = $originalPrice;
            $discountInfo = "Không có ưu đãi đặc biệt trên sản phẩm.";

            // $p->promotion chỉ tồn tại nếu có khuyến mãi đang hoạt động và được gán cho sản phẩm.
            if ($p->promotion && isset($p->promotion->discount_percent)) {
                $promotion = $p->promotion;
                $promotionPercent = $promotion->discount_percent ?? 0; 
                
                if ($promotionPercent > 0) {
                    // Tính giá sau khi áp dụng chiết khấu
                    $finalPrice = $originalPrice * (1 - $promotionPercent / 100);
                    $discountInfo = "Đang giảm giá: **{$promotion->name}** ({$promotionPercent}%)"; 
                }
            }
            
            // Làm tròn giá cuối cùng để hiển thị số nguyên
            $finalPriceRounded = round($finalPrice, 0);

            $text .= "- {$p->product->name} ({$p->product->brand->name}) \n" .
                    "       Giá gốc: " . number_format($originalPrice) . "đ \n" .
                    "       Giá sau giảm: " . number_format($finalPriceRounded) . "đ \n" .
                    "       Chiết khấu: {$discountInfo}\n" .
                    "       RAM/ROM: {$p->memory?->ram} / {$p->memory?->internal_storage} \n" .
                    "       Camera trước: {$p->frontCamera?->resolution} \n" .
                    "       Camera sau: {$p->rearCamera?->resolution} \n" .
                    "       Pin: {$p->battery?->battery_capacity} \n" .
                    "       Màn hình: {$p->screen?->size} \n" .
                    "       Tồn kho: {$p->stock_quantity}\n";
        }

        return $text;
    }

    private function formatDiscountsForAI(Collection $discounts)
    {
        if ($discounts->isEmpty()) return "Hiện không có mã giảm giá nào đang hoạt động.";

        $text = "";
        foreach ($discounts as $d) {
            $text .= "- Mã: **{$d->code}** | Giảm: **{$d->percentage}%** | HSD: {$d->end_date->format('d/m/Y')}\n";
        }
        return $text;
    }

    private function formatPromotionsForAI(Collection $promotions)
    {
        if ($promotions->isEmpty()) return "Hiện không có chương trình khuyến mãi nào đang hoạt động.";

        $text = "";
        foreach ($promotions as $p) {
            $discountText = isset($p->discount_percent) && $p->discount_percent > 0 ? " (Giảm {$p->discount_percent}%)" : "";
            $text .= "- **{$p->name}**{$discountText} | Áp dụng từ: {$p->start_date->format('d/m/Y')} đến {$p->end_date->format('d/m/Y')}\n";
        }
        return $text;
    }

    private function formatPaymentMethodsForAI(array $methods)
    {
        $text = "";
        foreach ($methods as $method) {
            $text .= "- {$method}\n";
        }
        return $text;
    }
}