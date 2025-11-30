<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Doanh thu 12 tháng gần nhất
     */
    public function revenue()
    {
        $revenues = [];
        $labels = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $total = Order::whereYear('created_at', $month->year)
                          ->whereMonth('created_at', $month->month)
                          ->sum('final_amount');

            $revenues[] = $total;
            $labels[] = $month->format('m/Y'); // "11/2025"
        }

        return response()->json([
            'labels' => $labels,
            'values' => $revenues
        ]);
    }

    /**
     * Summary 30 ngày
     */
    public function summary30Days()
    {
        $now = Carbon::now();
        $start = $now->copy()->subDays(30);

        $totalRevenue = Order::whereBetween('created_at', [$start, $now])->sum('final_amount');
        $newOrders = Order::whereBetween('created_at', [$start, $now])->count();
        $newCustomers = \App\Models\Customer::whereBetween('created_at', [$start, $now])->count();
        $totalProducts = \App\Models\ProductDetail::sum('stock_quantity');

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'newOrders' => $newOrders,
            'newCustomers' => $newCustomers,
            'totalProducts' => $totalProducts,
        ]);
    }

    /**
     * Top 5 sản phẩm bán chạy
     */
    public function topProducts()
    {
        $products = DB::table('order_details')
            ->join('product_details', 'order_details.product_detail_id', '=', 'product_details.id')
            ->join('products', 'product_details.product_id', '=', 'products.id')
            ->select('products.id', 'products.name')
            ->selectRaw('SUM(order_details.quantity) as sold')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold')
            ->limit(5)
            ->get();

        return response()->json($products);
    }
    public function ordersByStatus()
    {
        // Lấy số lượng theo từng trạng thái
        $data = Order::select('order_status', DB::raw('COUNT(*) as total'))
            ->groupBy('order_status')
            ->get();

        // Chuyển sang mảng key => value
        $result = [];
        foreach ($data as $row) {
            $result[$row->order_status] = $row->total;
        }

        return response()->json($result);
    }

    /**
     * Biểu đồ số lượng khách hàng theo tuần (4 tuần gần nhất)
     */
    public function customersByWeek()
    {
        $now = Carbon::now();
        $weeks = [];

        // Lấy 4 tuần gần nhất
        for ($i = 3; $i >= 0; $i--) {
            $startOfWeek = $now->copy()->subWeeks($i)->startOfWeek(); // Thứ 2
            $endOfWeek = $now->copy()->subWeeks($i)->endOfWeek();     // Chủ nhật

            $count = Customer::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
            $label = $startOfWeek->format('d/m') . ' - ' . $endOfWeek->format('d/m');

            $weeks[] = [
                'label' => $label,
                'count' => $count
            ];
        }

        return response()->json($weeks);
    }
}
