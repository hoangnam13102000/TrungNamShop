import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../../../components/Carousel/ProductCarousel";
import RecommendedProducts from "../../../components/product/RecommendedProducts";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import backgroundImage from "@banner/background-4.jpg";
import ChatWidget from "../../../components/Chats/ChatWidget";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import ChatBubble from "../../../components/Chats/MessengerChat";
const HomePage = () => {
  const { useGetAll } = useCRUDApi("products");
  const { data: products = [], isLoading } = useGetAll();

  const [topBrands, setTopBrands] = useState([]);
  const [userId, setUserId] = useState(null);

  // Dialog state trung tâm
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  // Lấy account_id từ localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("account_id");
    setUserId(storedId ? Number(storedId) : 1);
  }, []);

  // Top Brands
  useEffect(() => {
    if (products.length > 0) {
      const brandMap = {};
      products.forEach((product) => {
        if (!product) return;
        const brand = product.brand || { id: 0, name: "Khác", image: null };
        const brandId = brand.id;
        if (!brandMap[brandId]) brandMap[brandId] = { brand, products: [] };
        brandMap[brandId].products.push(product);
      });

      const sortedBrands = Object.values(brandMap)
        .sort((a, b) => b.products.length - a.products.length)
        .slice(0, 2);

      setTopBrands(sortedBrands);
    }
  }, [products]);

  useEffect(() => {
    const handler = (e) => {
      setAddedProduct(e.detail.product);
      setDialogOpen(true);
    };
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  return (
    <div className="w-full relative">
      {/* Banner Section */}
      <section
        className="w-full py-16 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 md:border-8 border-red-600">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Sản Phẩm Bán Chạy
              </h2>
              <p className="text-gray-600 mt-2">
                Những sản phẩm được ưa chuộng nhất
              </p>
            </div>

            {!isLoading && <ProductCarousel products={products} />}

            <div className="text-center mt-10">
              <Link
                to="/danh-sach-san-pham"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-xl"
              >
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products Carousel */}
      {userId && <RecommendedProducts userId={userId} />}

      {/* Brand Carousels */}
      {!isLoading && topBrands.length > 0 && (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 space-y-12">
            {topBrands.map(({ brand, products }) => (
              <section key={brand.id} className="relative">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {brand.image && (
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="h-12 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {products.length} sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1 ml-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <ProductCarousel products={products} />
                </div>

                <div className="text-right mt-4">
                  <Link
                    to={`/danh-sach-san-pham?brands=${brand.id}`}
                    className="text-gray-600 hover:text-red-600 font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    Xem tất cả {brand.name}
                    <span>→</span>
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Messenger Widget */}
      <ChatBubble/>
      {/* Chat Widget */}
      <ChatWidget />

      {/* Dialog trung tâm */}
      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Thành công!"
        message={addedProduct ? `${addedProduct.name} đã được thêm vào giỏ hàng.` : ""}
        onClose={() => setDialogOpen(false)}
        closeText="Đóng"
      />
    </div>
  );
};

export default memo(HomePage);
