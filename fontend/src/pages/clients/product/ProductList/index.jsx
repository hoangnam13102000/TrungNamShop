import { memo, useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../../../components/product/ProductCard";
import Dropdown from "../../../../components/UI/dropdown/DropDown";
import backgroundImage from "@banner/background-4.jpg";
import BreadCrumb from "../../theme/BreadCrumb";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá", min: 0, max: Infinity },
  { id: "under10", label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { id: "10to20", label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { id: "20to30", label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { id: "above30", label: "Trên 30 triệu", min: 30000000, max: Infinity },
];

const SORT_OPTIONS = [
  { id: "default", label: "Mặc định" },
  { id: "price-asc", label: "Giá thấp đến cao" },
  { id: "price-desc", label: "Giá cao đến thấp" },
  { id: "name-asc", label: "Tên A-Z" },
];

const MEMORY_OPTIONS = [
  { id: "all", label: "Tất cả", value: "all" },
  { id: "64", label: "64GB", value: "64" },
  { id: "128", label: "128GB", value: "128" },
  { id: "256", label: "256GB", value: "256" },
  { id: "512", label: "512GB", value: "512" },
];

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductList = () => {
  const query = useQuery();
  const brandQuery = query.get("brand");
  // 👉 Đọc tham số tìm kiếm theo tên từ URL
  const searchQuery = query.get("search");

  /** ===============================
   *   Lấy dữ liệu qua useCRUDApi
   * =============================== */
  // Giả định `useGetProducts()` trả về TẤT CẢ sản phẩm và việc lọc được thực hiện ở client (như code hiện tại của bạn)
  const { useGetAll: useGetProducts } = useCRUDApi("products");
  const { useGetAll: useGetBrands } = useCRUDApi("brands");

  const { data: products = [], isLoading } = useGetProducts();
  const { data: brandsData = [] } = useGetBrands();

  /** ===============================
   *   Xử lý dữ liệu Brand & Product
   * =============================== */
  const brandMap = useMemo(() => {
    const map = {};
    brandsData.forEach((b) => {
      map[b.id] = b.name;
    });
    return map;
  }, [brandsData]);

  const [brandFilter, setBrandFilter] = useState(brandQuery || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [memoryFilter, setMemoryFilter] = useState("all");
  // Không cần state cho searchQuery vì nó được đọc trực tiếp từ URL

  useEffect(() => {
    // Cập nhật Brand Filter khi URL thay đổi (từ Header)
    setBrandFilter(brandQuery || "all");
    // Thiết lập lại các bộ lọc khác nếu có tìm kiếm mới
    if (searchQuery) {
      setPriceRange("all");
      setSortBy("default");
      setMemoryFilter("all");
    }
  }, [brandQuery, searchQuery]); // Thêm searchQuery vào dependencies

  const brandOptions = useMemo(() => {
    return [{ label: "Tất cả", value: "all" }, ...brandsData.map((b) => ({ label: b.name, value: b.id }))];
  }, [brandsData]);

  const mappedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      primary_image: p.primary_image ?? { image_path: p.image ?? null },
      newPrice: p.newPrice ?? p.price ?? 0,
      oldPrice: p.oldPrice ?? null,
    }));
  }, [products]);

  /** ===============================
   *   Bộ lọc sản phẩm
   * =============================== */

  // Chuẩn hóa từ khóa tìm kiếm (chuyển về chữ thường để tìm kiếm không phân biệt hoa thường)
  const lowerCaseSearchQuery = searchQuery ? searchQuery.toLowerCase().trim() : "";

  let filteredProducts = mappedProducts.filter((p) => {
    // 1. Lọc theo tên (Search Query)
    const matchesSearch = lowerCaseSearchQuery
      ? p.name.toLowerCase().includes(lowerCaseSearchQuery)
      : true; // Nếu không có searchQuery thì luôn true

    // 2. Lọc theo Thương hiệu
    const matchesBrand = brandFilter === "all" || p.brand?.id === Number(brandFilter);

    // 3. Lọc theo Bộ nhớ
    const matchesMemory = memoryFilter === "all" || p.memory === Number(memoryFilter);

    return matchesSearch && matchesBrand && matchesMemory;
  });

  const selectedRange = PRICE_RANGES.find((r) => r.id === priceRange);
  if (selectedRange) {
    filteredProducts = filteredProducts.filter(
      (p) => p.newPrice >= selectedRange.min && p.newPrice < selectedRange.max
    );
  }

  if (sortBy === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.newPrice - b.newPrice);
  else if (sortBy === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => b.newPrice - a.newPrice);
  else if (sortBy === "name-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));

  let title = brandFilter !== "all" ? brandMap[brandFilter] || "Sản phẩm" : "Tất cả sản phẩm";
  if (searchQuery) {
    title = `Kết quả tìm kiếm cho "${searchQuery}"`;
  }
  const brandName = title; // Đổi tên biến để phản ánh tiêu đề chính xác hơn

  /** ===============================
   *   Giao diện
   * =============================== */
  return (
    <div
      className="w-full min-h-screen py-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-red-600">
            <div className="text-sm text-gray-500 mb-4">
              <BreadCrumb name={brandName} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">{brandName}</h1>
            {searchQuery && (
              <p className="mb-4 text-red-600 font-semibold">
                Tìm kiếm đang hoạt động cho từ khóa: "{searchQuery}"
              </p>
            )}

            {/* 🔹 Bộ lọc */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* ... Các Dropdown Brand, Price, Sort, Memory giữ nguyên ... */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thương hiệu</label>
                  <Dropdown
                    label={brandFilter !== "all" ? brandMap[brandFilter] : "Tất cả"}
                    options={brandOptions}
                    onSelect={(option) => setBrandFilter(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng giá</label>
                  <Dropdown
                    label={PRICE_RANGES.find((r) => r.id === priceRange)?.label || "Tất cả"}
                    options={PRICE_RANGES.map((r) => ({ label: r.label, value: r.id }))}
                    onSelect={(option) => setPriceRange(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sắp xếp</label>
                  <Dropdown
                    label={SORT_OPTIONS.find((o) => o.id === sortBy)?.label || "Mặc định"}
                    options={SORT_OPTIONS.map((o) => ({ label: o.label, value: o.id }))}
                    onSelect={(option) => setSortBy(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bộ nhớ</label>
                  <Dropdown
                    label={memoryFilter === "all" ? "Tất cả" : memoryFilter + "GB"}
                    options={MEMORY_OPTIONS}
                    onSelect={(option) => setMemoryFilter(option.value)}
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Tìm thấy{" "}
                <span className="font-semibold text-red-600">{filteredProducts.length}</span> sản phẩm
              </div>
            </div>

            {/* 🔹 Danh sách sản phẩm */}
            {isLoading ? (
              <div className="text-center py-20">Đang tải sản phẩm...</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-400 text-sm mt-2">Vui lòng thử điều chỉnh bộ lọc</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductList);