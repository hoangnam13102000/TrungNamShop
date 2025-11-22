import ProductCarousel from "../Carousel/ProductCarousel";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";

const RecommendedProducts = () => {
  // Lấy userId từ localStorage, fallback = 1 nếu chưa login
  const userId = localStorage.getItem("account_id") || 1;

  // Sử dụng useCRUDApi như cũ
  const { useGetAll } = useCRUDApi(`recommendations/${userId}`);
  const { data: recommendedProducts = [] } = useGetAll();

  // Chuẩn hóa dữ liệu để giống product normal
  const normalizedProducts = recommendedProducts.map((p) => {
    const product = p.product ?? p;
    const detail = product.details?.[0] ?? {};
    const primaryImage = product.images?.find((img) => img.is_primary) ?? {};

    const imageUrl = primaryImage.image_path
      ? `http://127.0.0.1:8000/storage/${primaryImage.image_path.replace(/^\/+/, "")}`
      : "/fallback.jpg";

    return {
      ...product,
      final_price: detail.final_price ?? detail.price ?? 0,
      price: detail.price ?? 0,
      stock_quantity: detail.stock_quantity ?? 0,
      image: imageUrl,
      primary_image: primaryImage,
    };
  });

  if (!normalizedProducts.length) return null;

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Gợi Ý Cho Bạn
          </h2>
          <p className="text-gray-600 mt-2">
            Những sản phẩm bạn có thể quan tâm
          </p>
        </div>

        <ProductCarousel products={normalizedProducts} />
      </div>
    </section>
  );
};

export default RecommendedProducts;
