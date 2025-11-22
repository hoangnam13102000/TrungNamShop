<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GeminiService;
use RuntimeException;
use Carbon\Carbon;

use App\Models\Brand;
use App\Models\ProductDetail;
use App\Models\Discount;
use App\Models\Promotion;
use App\Models\Store; 
use Illuminate\Database\Eloquent\Collection;

class ChatbotController extends Controller
{
    protected GeminiService $gemini;
    protected string $systemPrompt;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;

        $this->systemPrompt =
            "Bạn là chatbot tư vấn bán hàng của website. 
            Khi trả lời, chỉ dựa trên dữ liệu sản phẩm, **thông tin cửa hàng**, và khuyến mãi tôi cung cấp từ database.
            Nếu khách hàng hỏi về hình ảnh và bạn thấy tag **[LINK_ANH_GOC]**, hãy cung cấp đường link này cho khách hàng. 
            Tránh đưa ra thông tin không có trong dữ liệu (ví dụ: không gợi ý mã giảm giá nếu không có mã nào được liệt kê).
            Trả lời ngắn gọn, gợi ý đúng nhu cầu khách hàng.";
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
            'user_role' => 'nullable|string',   // NHẬN TỪ FRONTEND
            'username' => 'nullable|string',    // NHẬN TỪ FRONTEND
        ]);

        $userMessage = $request->message;
        $userRole = $request->user_role ?? 'khách hàng'; // Mặc định là khách hàng
        $username = $request->username ?? 'Quý khách';   // Mặc định là Quý khách

        // ============================
        // 1.5 Lấy Prompt dựa trên vai trò người dùng
        // ============================
        $rolePrompt = $this->getRoleSpecificPrompt($userRole, $username);

        // ============================
        // 1 USER KEYWORD ANALYSIS
        // ============================
        $brandId = $this->detectBrand($userMessage);
        $priceRange = $this->detectPriceRange($userMessage);

        // 1.5 NEW KEYWORD ANALYSIS (Payment, Discount, Promotion, Image, Store)
        $isDiscountQuery = $this->detectDiscountQuery($userMessage);
        $isPromotionQuery = $this->detectPromotionQuery($userMessage);
        $isPaymentQuery = $this->detectPaymentQuery($userMessage);
        $isImageQuery = $this->detectImageQuery($userMessage);
        $isStoreQuery = $this->detectStoreQuery($userMessage); // <-- PHÁT HIỆN TỪ KHÓA CỬA HÀNG

        // ============================
        // 2 QUERY DATABASE
        // ============================

        $activeDiscounts = $this->searchActiveDiscounts();
        $activePromotions = $this->searchActivePromotions();
        $stores = $isStoreQuery ? $this->searchStores() : collect([]); // <-- TRUY VẤN CỬA HÀNG (chỉ khi cần)

        $products = $this->searchProducts($brandId, $priceRange);

        $productListText = $this->formatProductsForAI($products, $isImageQuery);

        // 2.5 NEW QUERY DATABASE (Discount, Promotion, Payment, Store)
        $discountListText = $isDiscountQuery ? $this->formatDiscountsForAI($activeDiscounts) : "";
        $promotionListText = $isPromotionQuery ? $this->formatPromotionsForAI($activePromotions) : "";
        $paymentMethodsText = $isPaymentQuery ? $this->formatPaymentMethodsForAI($this->getPaymentMethods()) : "";
        $storeListText = $isStoreQuery ? $this->formatStoresForAI($stores) : ""; // <-- ĐỊNH DẠNG DỮ LIỆU CỬA HÀNG

        // ============================
        // 3 BUILD PROMPT GỬI CHO AI
        // ============================
        $fullPrompt =
            $this->systemPrompt .
            "\n\n--- Thông tin người dùng ---" . // CHÈN THÔNG TIN VAI TRÒ
            "\n" . $rolePrompt . 
            "\n\n--- Dữ liệu từ Database ---" .
            "\n\nDữ liệu sản phẩm lấy từ database:\n" .
            ($productListText ?: "Không tìm thấy sản phẩm phù hợp.") .
            ($discountListText ? "\n\nMã giảm giá đang hoạt động:\n" . $discountListText : "") .
            ($promotionListText ? "\n\nChương trình khuyến mãi đang hoạt động:\n" . $promotionListText : "") .
            ($paymentMethodsText ? "\n\nPhương thức thanh toán được hỗ trợ:\n" . $paymentMethodsText : "") .
            ($storeListText ? "\n\nThông tin Chi nhánh Cửa hàng:\n" . $storeListText : "") . // <-- CHÈN THÔNG TIN CỬA HÀNG
            "\n\n--- Hết Dữ liệu ---\n" .
            "\n\nCâu hỏi từ khách hàng: " . $userMessage .
            "\n\nHãy tư vấn dựa trên dữ liệu trên.";

        // ============================
        // 4 GEMINI CONVERSATION
        // ============================
        $conversation = [
            // Gửi prompt hệ thống chứa thông tin vai trò cho Gemini
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
            'products' => $products, 
        ]);
    }

    // ===========================================
    //          ROLE-BASED PROMPT LOGIC
    // ===========================================
    
    /**
     * Tạo prompt tùy chỉnh cho AI dựa trên vai trò của người dùng.
     */
    private function getRoleSpecificPrompt(string $role, string $username): string
    {
        $roleDisplay = ucfirst($role);
        
        $prompt = "Bạn đang nói chuyện với **{$username}**, vai trò của người dùng này là **{$roleDisplay}**.\n";

        if ($role === 'admin' || $role === 'nhân viên') {
            // Prompt cho vai trò nội bộ
            $prompt .= "Vì người dùng là {$roleDisplay}, hãy cung cấp câu trả lời chi tiết, tập trung vào số liệu (tồn kho, giá gốc, chiết khấu) và hỗ trợ các truy vấn quản lý (ví dụ: tư vấn về chương trình khuyến mãi/mã giảm giá hiện tại). Giữ giọng điệu chuyên nghiệp, hỗ trợ tối đa cho nghiệp vụ.";
        } else { // 'khách hàng' hoặc default
            // Prompt cho vai trò khách hàng
            $prompt .= "Vì người dùng là {$roleDisplay}, hãy giữ giọng điệu thân thiện, tập trung vào lợi ích (giá sau giảm, chiết khấu, thông số quan trọng: pin, camera) và hướng dẫn mua hàng.";
        }

        return $prompt;
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

    private function detectImageQuery(string $message): bool
    {
        $keywords = ['ảnh', 'hình ảnh', 'cho xem', 'photo', 'picture'];
        $message = strtolower($message);
        foreach ($keywords as $keyword) {
            if (str_contains($message, $keyword)) return true;
        }
        return false;
    }
    
    /**
     * Phát hiện truy vấn liên quan đến thông tin cửa hàng/chi nhánh.
     */
    private function detectStoreQuery(string $message): bool
    {
        $keywords = ['cửa hàng', 'chi nhánh', 'địa chỉ', 'ở đâu', 'showroom', 'store'];
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
            'promotion' => function ($q) {
                $q->where('status', 'active')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now()->endOfDay());
            },
            // Eager load image (primary)
            'images' => fn($q) => $q->where('is_primary', 1)
        ]);

        if ($brandId) {
            $query->whereHas('product', fn($q) => $q->where('brand_id', $brandId));
        }

        if ($priceRange) {
            $query->whereBetween('price', [$priceRange['min'], $priceRange['max']]);
        }

        // Get 10 products
        return $query->limit(10)->get();
    }

    private function searchActiveDiscounts()
    {
        return Discount::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now()->endOfDay())
            ->get();
    }

    private function searchActivePromotions()
    {
        return Promotion::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now()->endOfDay())
            ->get();
    }
    
    /**
     * Lấy tất cả thông tin cửa hàng từ database.
     */
    private function searchStores()
    {
        return Store::all();
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
     * @param bool $includeImageFlag Nếu TRUE, thêm tag ảnh cho AI biết
     */
    private function formatProductsForAI(Collection $products, bool $includeImageFlag = false)
    {
        if ($products->isEmpty()) return "";

        $text = "";

        foreach ($products as $p) {
            $originalPrice = $p->price;
            $finalPrice = $originalPrice;
            $discountInfo = "Không có ưu đãi đặc biệt trên sản phẩm.";

            
            if ($p->promotion && isset($p->promotion->discount_percent)) {
                $promotion = $p->promotion;
                $promotionPercent = $promotion->discount_percent ?? 0;

                if ($promotionPercent > 0) {
                    $finalPrice = $originalPrice * (1 - $promotionPercent / 100);
                    $discountInfo = "Đang giảm giá: **{$promotion->name}** ({$promotionPercent}%)";
                }
            }

            $productName = "{$p->product->name} ({$p->product->brand->name})";

            // Lấy đường dẫn ảnh lưu trong DB
            $imagePath = optional($p->images->first())->image_path;
            // Tạo URL đầy đủ (giả định bạn lưu ảnh trong thư mục storage/app/public và dùng link symbolic)
            $path = 'storage/' . ltrim($imagePath, '/');
            $imageUrl = $imagePath ? url($path) : null;

            $imageTagForAI = "";
            // CHÈN TAG LINK ẢNH NẾU KHÁCH HÀNG HỎI VÀ CÓ ẢNH
            if ($includeImageFlag && $imageUrl) {
                $imageTagForAI = "  [LINK_ANH_GOC]: {$imageUrl}\n";
            }

            // Làm tròn giá cuối cùng để hiển thị số nguyên
            $finalPriceRounded = round($finalPrice, 0);

            $text .= "- {$p->product->name} ({$p->product->brand->name}) \n" .
                "  Giá gốc: " . number_format($originalPrice) . "đ \n" .
                "  Giá sau giảm: " . number_format($finalPriceRounded) . "đ \n" .
                "  Chiết khấu: {$discountInfo}\n" .
                " RAM/ROM: {$p->memory?->ram} / {$p->memory?->internal_storage} \n" .
                "  Camera trước: {$p->frontCamera?->resolution} \n" .
                "  Camera sau: {$p->rearCamera?->resolution} \n" .
                "  Pin: {$p->battery?->battery_capacity} \n" .
                "  Màn hình: {$p->screen?->size} \n" .
                "  Tồn kho: {$p->stock_quantity}\n" .
                $imageTagForAI; // Chèn tag link ảnh
        }

        return $text;
    }

    private function formatDiscountsForAI(Collection $discounts)
    {
        if ($discounts->isEmpty()) return "Hiện không có mã giảm giá nào đang hoạt động.";

        $text = "";
        foreach ($discounts as $d) {
            $endDate = optional($d->end_date)->format('d/m/Y') ?? 'N/A';
            $text .= "- Mã: **{$d->code}** | Giảm: **{$d->percentage}%** | HSD: {$endDate}\n";
        }
        return $text;
    }

    private function formatPromotionsForAI(Collection $promotions)
    {
        if ($promotions->isEmpty()) return "Hiện không có chương trình khuyến mãi nào đang hoạt động.";

        $text = "";
        foreach ($promotions as $p) {
            $discountText = isset($p->discount_percent) && $p->discount_percent > 0 ? " (Giảm {$p->discount_percent}%)" : "";

            $startDate = optional($p->start_date)->format('d/m/Y') ?? 'N/A';
            $endDate = optional($p->end_date)->format('d/m/Y') ?? 'N/A';

            $text .= "- **{$p->name}**{$discountText} | Áp dụng từ: {$startDate} đến {$endDate}\n";
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
    
    /**
     * Định dạng thông tin cửa hàng để gửi đến AI.
     */
    private function formatStoresForAI(Collection $stores)
    {
        if ($stores->isEmpty()) return "Không có thông tin chi nhánh cửa hàng nào.";

        $text = "Danh sách Chi nhánh Cửa hàng:\n";
        foreach ($stores as $s) {
            $text .= "- **{$s->name}**\n";
            $text .= "  Địa chỉ: {$s->address}\n";
            $text .= "  Điện thoại: {$s->phone}\n";
            // Thêm link Google Map nếu có để AI gợi ý cho khách hàng
            if ($s->google_map) {
                 $text .= "  Bản đồ: {$s->google_map}\n";
            }
        }
        return $text;
    }
}