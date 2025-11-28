import { memo, useEffect, useState } from "react";
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

import {
  FaShoppingCart,
  FaUsers,
  FaMobileAlt,
  FaBox,
  FaChartBar,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    newOrders: 0,
    newCustomers: 0,
    totalProducts: 0,
  });
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // 1. Doanh thu 12 tháng
    fetch("http://localhost:8000/api/dashboard/revenue")
      .then((res) => res.json())
      .then((data) => {
        setChartData({ labels: data.labels, values: data.values });
      })
      .catch(() => setChartData({ labels: [], values: [] }));

    // 2. Summary 30 ngày
    fetch("http://localhost:8000/api/dashboard/summary-30days")
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          totalRevenue: data.totalRevenue ?? 0,
          newOrders: data.newOrders ?? 0,
          newCustomers: data.newCustomers ?? 0,
          totalProducts: data.totalProducts ?? 0,
        });
      })
      .catch(() =>
        setSummary({
          totalRevenue: 0,
          newOrders: 0,
          newCustomers: 0,
          totalProducts: 0,
        })
      );

    // 3. Top 5 sản phẩm
    fetch("http://localhost:8000/api/dashboard/top-products")
      .then((res) => res.json())
      .then((data) => {
        setTopProducts(
          data.map((p) => ({ product_name: p.name, sold: p.sold }))
        );
      })
      .catch(() => setTopProducts([]));
  }, []);

  const pieColors = [
    "rgba(249, 115, 22, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(168, 85, 247, 0.8)",
    "rgba(59, 130, 246, 0.8)",
    "rgba(34, 197, 94, 0.8)",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 border-b pb-3">
            Bảng Điều Khiển
          </h1>
          <p className="text-gray-600 text-sm">
            Tổng quan về hiệu suất kinh doanh của bạn
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Các Chỉ Số Hoạt Động (30 Ngày)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard
              name="Tổng Doanh Thu (30 ngày)"
              Icon={FaBox}
              value={Math.round(summary.totalRevenue).toLocaleString() + " VNĐ"}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
              path="/revenues"
            />
            <DashboardCard
              name="Đơn Hàng Mới"
              Icon={FaShoppingCart}
              value={summary.newOrders.toLocaleString()}
              color="bg-gradient-to-br from-green-500 to-green-600"
              path="/orders"
            />
            <DashboardCard
              name="Khách Hàng Mới"
              Icon={FaUsers}
              value={summary.newCustomers.toLocaleString()}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              path="/customers"
            />
            <DashboardCard
              name="Tổng Sản Phẩm Trong Kho"
              Icon={FaMobileAlt}
              value={summary.totalProducts.toLocaleString()}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              path="/products"
            />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doanh thu 12 tháng */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-1">
                <FaChartBar className="text-blue-600 text-2xl" />
                <h3 className="text-xl font-bold text-gray-800">
                  Doanh Thu 12 Tháng
                </h3>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Biểu đồ doanh thu theo tháng
              </p>
            </div>
            <div className="p-6">
              {chartData.labels.length === 0 ? (
                <div className="h-72 w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-gray-600">Đang tải biểu đồ...</p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    position: "relative",
                    height: "350px",
                    width: "100%",
                  }}
                >
                  <Bar
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Doanh thu (VNĐ)",
                          data: chartData.values,
                          backgroundColor: "rgba(59,130,246,0.8)",
                          borderColor: "rgba(59,130,246,1)",
                          borderWidth: 2,
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (v) => (v / 1000000).toFixed(0) + " Tr",
                          },
                        },
                        x: { ticks: { autoSkip: false } },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Top sản phẩm - Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-bold text-gray-800">
                  Top 5 Sản Phẩm Bán Chạy
                </h3>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Số lượng bán theo sản phẩm
              </p>
            </div>
            <div className="p-6">
              {topProducts.length === 0 ? (
                <div className="h-72 w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    position: "relative",
                    height: "350px",
                    width: "100%",
                  }}
                >
                  <Pie
                    data={{
                      labels: topProducts.map((p) => p.product_name),
                      datasets: [
                        {
                          label: "Số lượng bán",
                          data: topProducts.map((p) => p.sold),
                          backgroundColor: pieColors,
                          borderColor: pieColors.map((c) =>
                            c.replace("0.8", "1")
                          ),
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "right" },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.parsed} đơn`,
                          },
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
