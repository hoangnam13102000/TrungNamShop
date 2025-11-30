import { memo } from "react";
import DashboardCard from "../../../components/UI/cards/DashboardCard";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { FaShoppingCart, FaUsers, FaMobileAlt, FaBox, FaChartBar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios"; // import axios instance

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ===== Hooks React Query v5 =====
const useRevenue = () =>
  useQuery({
    queryKey: ["dashboardRevenue"],
    queryFn: async () => {
      const res = await api.get("/dashboard/revenue");
      return res.data; // { labels, values }
    },
  });

const useSummary = () =>
  useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary-30days");
      return res.data; // { totalRevenue, newOrders, newCustomers, totalProducts }
    },
  });

const useTopProducts = () =>
  useQuery({
    queryKey: ["dashboardTopProducts"],
    queryFn: async () => {
      const res = await api.get("/dashboard/top-products");
      return res.data; // array [{ product_name, sold }]
    },
  });

const Dashboard = () => {
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue();
  const { data: summary = {}, isLoading: loadingSummary } = useSummary();
  const { data: topProducts = [], isLoading: loadingTopProducts } = useTopProducts();

  const pieColors = [
    "rgba(249, 115, 22, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(168, 85, 247, 0.8)",
    "rgba(59, 130, 246, 0.8)",
    "rgba(34, 197, 94, 0.8)",
  ];

  // Safe formatter - format as integer
  const formatNumber = (num) => Math.round(num || 0).toLocaleString('vi-VN');

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3">
              Bảng Điều Khiển
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm mt-4">Tổng quan về hiệu suất kinh doanh của bạn</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Các Chỉ Số Hoạt Động (30 Ngày)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <DashboardCard
              name="Tổng Doanh Thu (30 ngày)"
              Icon={FaBox}
              value={formatNumber(summary.totalRevenue) + " VNĐ"}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
            <DashboardCard
              name="Đơn Hàng Mới"
              Icon={FaShoppingCart}
              value={formatNumber(summary.newOrders)}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <DashboardCard
              name="Khách Hàng Mới"
              Icon={FaUsers}
              value={formatNumber(summary.newCustomers)}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <DashboardCard
              name="Tổng Sản Phẩm Trong Kho"
              Icon={FaMobileAlt}
              value={formatNumber(summary.totalProducts)}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-center gap-3 mb-1">
                <FaChartBar className="text-blue-600 text-2xl" />
                <h3 className="text-xl font-bold text-gray-800">Doanh Thu 12 Tháng</h3>
              </div>
              <p className="text-gray-600 text-sm mt-1">Biểu đồ doanh thu theo tháng</p>
            </div>
            <div className="p-6">
              {loadingRevenue ? (
                <div className="h-72 w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-gray-600">Đang tải biểu đồ...</p>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", height: "350px", width: "100%" }}>
                  <Bar
                    data={{
                      labels: revenueData.labels,
                      datasets: [
                        {
                          label: "Doanh thu (VNĐ)",
                          data: revenueData.values,
                          backgroundColor: "rgba(59,130,246,0.8)",
                          borderColor: "rgba(59,130,246,1)",
                          borderWidth: 2,
                          borderRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { color: "#374151", font: { size: 12 } },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(209,213,219,0.3)" },
                          ticks: {
                            color: "#6b7280",
                            callback: (v) => (v / 1000000).toFixed(0) + " Tr",
                          },
                        },
                        x: {
                          grid: { color: "rgba(209,213,219,0.3)" },
                          ticks: { color: "#6b7280", autoSkip: false },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Top Products Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-bold text-gray-800">Top 5 Sản Phẩm Bán Chạy</h3>
              </div>
              <p className="text-gray-600 text-sm mt-1">Số lượng bán theo sản phẩm</p>
            </div>
            <div className="p-6">
              {loadingTopProducts ? (
                <div className="h-72 w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", height: "350px", width: "100%" }}>
                  <Pie
                    data={{
                      labels: topProducts.map((p) => p.name || p.product_name),
                      datasets: [
                        {
                          label: "Số lượng bán",
                          data: topProducts.map((p) => p.sold),
                          backgroundColor: pieColors,
                          borderColor: pieColors.map((c) => c.replace("0.8", "1")),
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: { color: "#374151", font: { size: 12 } },
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.parsed} đơn`,
                          },
                          backgroundColor: "rgba(31,41,55,0.9)",
                          titleColor: "#f3f4f6",
                          bodyColor: "#e5e7eb",
                          borderColor: "rgba(209,213,219,0.3)",
                          borderWidth: 1,
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Dashboard);