<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * Lấy danh sách gợi ý sản phẩm cho một sản phẩm cụ thể
     */
    public function getRecommendations(Request $request, $product_id)
    {
        $user_id = $request->user()?->id ?? null;

        // Lấy sản phẩm chính kèm các quan hệ
        $product = Product::with([
            'details.memory',
            'details.rearCamera',
            'details.frontCamera',
            'details.screen',
            'details.batteryCharging',
            'brand',
            'images'
        ])->findOrFail($product_id);

        // Lấy detail đầu tiên (nếu có nhiều variants)
        $productDetail = $product->details->first();

        // 1️⃣ Content-based similarity
        $similarProducts = $this->contentBased($product, $productDetail);

        // 2️⃣ Collaborative filtering
        $collabProducts = $user_id ? $this->collaborativeBased($user_id) : collect();

        // 3️⃣ Hybrid scoring
        $finalProducts = $this->hybridScore($similarProducts, $collabProducts);

        return response()->json([
            'data' => $finalProducts->take(5)->map(fn($item) => $item['product'])->values()
        ]);
    }

    /**
     * Content-based: so sánh thuộc tính kỹ thuật
     */
    private function contentBased($product, $productDetail)
    {
        $allProducts = Product::with([
            'details.memory',
            'details.rearCamera',
            'details.frontCamera',
            'details.screen',
            'details.batteryCharging',
            'brand',
            'images'
        ])->where('id', '<>', $product->id)->get();

        $similarities = $allProducts->map(function ($p) use ($productDetail) {
            $pDetail = $p->details->first();
            if (!$pDetail) return ['product' => $p, 'score' => 0];

            return [
                'product' => $p,
                'score' => $this->calculateSimilarity($productDetail, $pDetail)
            ];
        });

        return $similarities->sortByDesc('score');
    }

    /**
     * Tính điểm tương đồng giữa 2 chi tiết sản phẩm
     */
    private function calculateSimilarity($a, $b)
    {
        $score = 0;

        // RAM
        if ($a->memory?->ram && $b->memory?->ram) {
            $score += ($a->memory->ram === $b->memory->ram) ? 2 : 0;
        }

        // ROM
        if ($a->memory?->internal_storage && $b->memory?->internal_storage) {
            $score += ($a->memory->internal_storage === $b->memory->internal_storage) ? 2 : 0;
        }

        // Rear camera
        if ($a->rearCamera?->resolution && $b->rearCamera?->resolution) {
            $score += ($a->rearCamera->resolution === $b->rearCamera->resolution) ? 1.5 : 0;
        }

        // Screen size
        if ($a->screen?->size && $b->screen?->size) {
            $score += ($a->screen->size === $b->screen->size) ? 1 : 0;
        }

        // Battery capacity
        if ($a->batteryCharging?->battery_capacity && $b->batteryCharging?->battery_capacity) {
            $score += ($a->batteryCharging->battery_capacity === $b->batteryCharging->battery_capacity) ? 1 : 0;
        }

        return $score;
    }

    /**
     * Collaborative filtering: dựa trên lịch sử mua hàng
     */
    private function collaborativeBased($user_id)
    {
        // Lấy tất cả sản phẩm user đã mua
        $userProductIds = OrderDetail::whereHas('order', fn($q) => $q->where('customer_id', $user_id))
            ->pluck('product_id');

        // Lấy sản phẩm khác được mua cùng với những sản phẩm này
        $coPurchased = OrderDetail::whereIn('product_id', $userProductIds)
            ->whereNotIn('product_id', $userProductIds)
            ->selectRaw('product_id, COUNT(*) as score')
            ->groupBy('product_id')
            ->orderByDesc('score')
            ->get();

        $products = Product::with(['images', 'brand'])
            ->whereIn('id', $coPurchased->pluck('product_id'))
            ->get();

        return $coPurchased->map(function ($item) use ($products) {
            return [
                'product' => $products->where('id', $item->product_id)->first(),
                'score' => $item->score
            ];
        });
    }

    /**
     * Kết hợp Content + Collaborative (Hybrid)
     */
    private function hybridScore($content, $collab, $alpha = 0.7, $beta = 0.3)
    {
        $collabMap = $collab->keyBy(fn($c) => $c['product']->id);

        return $content->map(function ($c) use ($collabMap, $alpha, $beta) {
            $collabScore = $collabMap[$c['product']->id]['score'] ?? 0;
            $c['score'] = $alpha * $c['score'] + $beta * $collabScore;
            return $c;
        })->sortByDesc('score');
    }
}
