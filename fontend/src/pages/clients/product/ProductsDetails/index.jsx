import { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../theme/BreadCrumb";
import ImageCarousel from "../../../../components/Carousel/ImageCarousel";
import SpecModal from "../../../../components/product/specs/SpecModal";
import ProductInfo from "../../../../components/product/ProductInfo";
import ReviewForm from "../../../../components/product/review/ReviewForm";
import ReviewSummary from "../../../../components/product/review/ReviewSummary";
import ReviewList from "../../../../components/product/review/ReviewList";
import { useProductDetailById } from "../../../../api/product/productDetail";
import { useAuth } from "../../../../context/AuthContext";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import { buildSpecs } from "../../../../utils/helpers/buildSpecs";
import ChatWidget from "../../../../components/Chats/ChatWidget";
const ProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);
  const { data, isLoading, error } = useProductDetailById(productId);
  const { user: account } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "success",
    title: "",
    message: "",
  });

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  };

  useEffect(() => loadCart(), []);
  useEffect(() => {
    const handleCartUpdated = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  const handleAddToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    let updated = existing
      ? cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { ...product, quantity: 1 }];

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));

    setDialog({
      open: true,
      mode: "success",
      title: "Thêm vào giỏ hàng",
      message: `Sản phẩm "${product.name}" đã được thêm vào giỏ hàng.`,
    });
  };

  // =========================== Fetch reviews ===========================
  const reviewsApi = useCRUDApi("reviews");
  const getReviews = reviewsApi.useGetAll();
  const createReview = reviewsApi.useCreate({
    onSuccess: (newReview) => {
      if (Number(newReview.product_id) === productId)
        setReviews((prev) => [newReview, ...prev]);
    },
    onError: (err) => {
      console.error("Gửi review thất bại:", err);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Gửi đánh giá thất bại, vui lòng thử lại.",
      });
    },
  });

  useEffect(() => {
    if (getReviews.data) {
      const filtered = getReviews.data.filter(
        (r) => Number(r.product_id) === productId
      );
      setReviews(filtered);
    }
  }, [getReviews.data, productId]);

  // =========================== Loading / Error ===========================
  if (isLoading) return <p className="text-center mt-8">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center mt-8 text-red-500">Lỗi: {error.message}</p>
    );
  if (!data)
    return (
      <p className="text-center mt-8 text-gray-600">Không tìm thấy sản phẩm.</p>
    );

  const product = data.product || data;
  const images =
    data.images?.length > 0
      ? data.images
      : product.primary_image
      ? [product.primary_image]
      : ["/placeholder.png"];

  // =========================== Build full specs ===========================
  const specs = buildSpecs(data); // Sử dụng buildSpecs để tạo toàn bộ specs

  const breadcrumbPaths = [
    { name: "Trang chủ", to: "/" },
    { name: "Danh sách sản phẩm", to: "/danh-sach-san-pham" },
    { name: product.name },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <BreadCrumb paths={breadcrumbPaths} />

        {/* Product images & info */}
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ImageCarousel images={images} />
          </div>

          <ProductInfo
            product={product}
            specs={specs}
            showAddToCart={true}
            onShowSpecs={() => setShowSpecModal(true)}
            onAddToCart={() =>
              handleAddToCart({
                id: product.id,
                name: product.name,
                image: product.primary_image || "/placeholder.png",
                price: product.newPrice || product.price || 0,
              })
            }
          />
        </div>

        {/* Modal hiển thị toàn bộ specs */}
        <SpecModal
          specs={specs}
          isOpen={showSpecModal}
          onClose={() => setShowSpecModal(false)}
        />

        {/* Reviews section */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <ReviewForm
              productId={productId}
              accountId={account?.account_id}
              onSuccess={(newReview) => {
                if (Number(newReview.product_id) === productId)
                  setReviews((prev) => [newReview, ...prev]);
              }}
            />
          </div>
          <ReviewSummary reviews={reviews} productId={productId} />
        </div>

        <div className="mt-12">
          <ReviewList reviews={reviews} />
        </div>

        {/* Dynamic Dialog */}
        <DynamicDialog
          open={dialog.open}
          mode={dialog.mode}
          title={dialog.title}
          message={dialog.message}
          onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        />
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
};

export default memo(ProductDetail);
