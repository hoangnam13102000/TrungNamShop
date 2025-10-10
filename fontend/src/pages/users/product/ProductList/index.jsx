import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../../../components/ProductCard";
import Dropdown from "../../../../components/DropDown"; 
import backgroundImage from "@banner/background-4.jpg";
import BreadCrumb from "../../theme/BreadCrumb";

const PRODUCTS = [
  { id: 1, brand: "iphone", memory: 128, name: "iPhone 13 128GB - Xanh dương", image: "/iphone13.png", oldPrice: 30000000, newPrice: 28500000 },
  { id: 2, brand: "iphone", memory: 256, name: "iPhone 14 Pro 256GB - Đen", image: "/iphone13.png", oldPrice: 35000000, newPrice: 32000000 },
  { id: 3, brand: "samsung", memory: 256, name: "Samsung Galaxy S23 Ultra 256GB", image: "/samsung.png", oldPrice: 28000000, newPrice: 25000000 },
  { id: 4, brand: "xiaomi", memory: 512, name: "Xiaomi 13T Pro 12GB/512GB", image: "/xiaomi.png", oldPrice: 18000000, newPrice: 16000000 },
  { id: 5, brand: "iphone", memory: 256, name: "iPhone 15 Pro Max 256GB", image: "/iphone13.png", oldPrice: 34000000, newPrice: 29990000 },
  { id: 6, brand: "samsung", memory: 512, name: "Samsung Galaxy Z Fold 5", image: "/samsung.png", oldPrice: 40000000, newPrice: 35000000 },
];

const BRANDS = {
  iphone: "iPhone",
  samsung: "Samsung",
  xiaomi: "Xiaomi",
  oppo: "OPPO",
  vivo: "Vivo",
  realme: "Realme",
};

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

const ProductList = () => {
  const { brand } = useParams();

  const [brandFilter, setBrandFilter] = useState(brand || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [memoryFilter, setMemoryFilter] = useState("all");

  // Filter products by brand
  let filteredProducts = PRODUCTS.filter(product => 
    (brandFilter === "all" || product.brand === brandFilter) &&
    (memoryFilter === "all" || product.memory === Number(memoryFilter))
  );

  // Filter products by price
  const selectedRange = PRICE_RANGES.find(r => r.id === priceRange);
  if (selectedRange) {
    filteredProducts = filteredProducts.filter(
      product => product.newPrice >= selectedRange.min && product.newPrice < selectedRange.max
    );
  }

  // Sort
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.newPrice - b.newPrice);
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.newPrice - a.newPrice);
  } else if (sortBy === "name-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const brandName = brandFilter !== "all" ? BRANDS[brandFilter] || "Sản phẩm" : "Tất cả sản phẩm";

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
              <BreadCrumb name="Danh sách sản phẩm"/>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">{brandName}</h1>

            {/* Filter Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thương hiệu</label>
                  <Dropdown
                    label={brandFilter !== "all" ? BRANDS[brandFilter] : "Tất cả"}
                    options={[{ label: "Tất cả", value: "all" }, ...Object.entries(BRANDS).map(([key, value]) => ({ label: value, value: key }))]}
                    onSelect={(option) => setBrandFilter(option.value)}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng giá</label>
                  <Dropdown
                    label={PRICE_RANGES.find(r => r.id === priceRange)?.label || "Tất cả"}
                    options={PRICE_RANGES.map(r => ({ label: r.label, value: r.id }))}
                    onSelect={(option) => setPriceRange(option.value)}
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sắp xếp</label>
                  <Dropdown
                    label={SORT_OPTIONS.find(o => o.id === sortBy)?.label || "Mặc định"}
                    options={SORT_OPTIONS.map(o => ({ label: o.label, value: o.id }))}
                    onSelect={(option) => setSortBy(option.value)}
                  />
                </div>

                {/* Memory */}
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
                Tìm thấy <span className="font-semibold text-red-600">{filteredProducts.length}</span> sản phẩm
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📱</div>
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
