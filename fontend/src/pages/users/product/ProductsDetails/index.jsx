import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../theme/BreadCrumb";
import ImageCarousel from "../../../../components/product/ImageCarousel";
import SpecModal from "../../../../components/product/specs/SpecModal";
import ProductInfo from "../../../../components/product/ProductInfo";
import ReviewForm from "../../../../components/product/review/ReviewForm";
import ReviewSummary from "../../../../components/product/review/ReviewSummary";
import ReviewList from "../../../../components/product/review/ReviewList";
import { useProductDetailById } from "../../../../api/product/productDetail";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);
  const { data, isLoading, error } = useProductDetailById(productId);

  const [reviews, setReviews] = useState([]);
  const [showSpecModal, setShowSpecModal] = useState(false);

  if (isLoading) return <p className="text-center mt-8">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Lỗi: {error.message}</p>;
  if (!data) return <p className="text-center mt-8 text-gray-600">Không tìm thấy sản phẩm.</p>;

  const product = data.product || data;
  const images =
    data.images?.length > 0
      ? data.images
      : product.primary_image
      ? [product.primary_image]
      : ["/placeholder.png"];

  // --- Build specs ---
  const specs = [];

  if (data.general_information) {
    specs.push({
      category: "Thông tin chung",
      details: [
        { label: "Thiết kế", value: data.general_information.design },
        { label: "Chất liệu", value: data.general_information.material },
        { label: "Kích thước", value: data.general_information.dimensions },
        { label: "Khối lượng", value: data.general_information.weight },
        { label: "Ngày ra mắt", value: data.general_information.launch_time },
      ],
    });
  }

  if (data.screen) {
    specs.push({
      category: "Màn hình",
      details: [
        { label: "Công nghệ hiển thị", value: data.screen.display_technology },
        { label: "Độ phân giải", value: data.screen.resolution },
        { label: "Kích thước màn hình", value: data.screen.screen_size },
        { label: "Độ sáng tối đa", value: data.screen.max_brightness },
        { label: "Kính bảo vệ", value: data.screen.glass_protection },
      ],
    });
  }

  if (data.rear_camera) {
    specs.push({
      category: "Camera sau",
      details: [
        { label: "Độ phân giải", value: data.rear_camera.resolution },
        { label: "Khẩu độ", value: data.rear_camera.aperture },
        { label: "Quay video", value: data.rear_camera.video_capability },
        { label: "Tính năng", value: data.rear_camera.features },
      ],
    });
  }

  if (data.front_camera) {
    specs.push({
      category: "Camera trước",
      details: [
        { label: "Độ phân giải", value: data.front_camera.resolution },
        { label: "Khẩu độ", value: data.front_camera.aperture },
        { label: "Quay video", value: data.front_camera.video_capability },
        { label: "Tính năng", value: data.front_camera.features },
      ],
    });
  }

  if (data.memory) {
    specs.push({
      category: "Bộ nhớ",
      details: [
        { label: "RAM", value: data.memory.ram },
        { label: "Bộ nhớ trong", value: data.memory.internal_storage },
        { label: "Khe thẻ nhớ", value: data.memory.memory_card_slot },
      ],
    });
  }

  if (data.operating_system) {
    specs.push({
      category: "Hệ điều hành",
      details: [
        { label: "Hệ điều hành", value: data.operating_system.name },
        { label: "Bộ xử lý", value: data.operating_system.processor },
        { label: "Tốc độ CPU", value: data.operating_system.cpu_speed },
        { label: "GPU", value: data.operating_system.gpu },
      ],
    });
  }

  if (data.battery_charging) {
    specs.push({
      category: "Pin & Sạc",
      details: [
        { label: "Dung lượng pin", value: data.battery_charging.battery_capacity },
        { label: "Cổng sạc", value: data.battery_charging.charging_port },
        { label: "Công nghệ sạc", value: data.battery_charging.charging },
      ],
    });
  }

  if (data.utility) {
    specs.push({
      category: "Tiện ích",
      details: [
        { label: "Bảo mật nâng cao", value: data.utility.advanced_security },
        { label: "Tính năng đặc biệt", value: data.utility.special_features },
        { label: "Chống nước / bụi", value: data.utility.water_dust_resistance },
      ],
    });
  }

  if (data.communication_connectivity) {
    specs.push({
      category: "Kết nối & Giao tiếp",
      details: [
        { label: "NFC", value: data.communication_connectivity.nfc },
        { label: "Khe SIM", value: data.communication_connectivity.sim_slot },
        { label: "Mạng di động", value: data.communication_connectivity.mobile_network },
        { label: "Định vị GPS", value: data.communication_connectivity.gps },
      ],
    });
  }


  // --- Handle reviews ---
  const handleAddReview = ({ rating, comment }) => {
    setReviews([
      {
        id: Date.now(),
        name: "Khách ẩn danh",
        stars: rating,
        content: comment,
        date: new Date().toISOString().split("T")[0],
      },
      ...reviews,
    ]);
  };

  const breadcrumbPaths = [
    { name: "Trang chủ", to: "/" },
    { name: "Danh sách sản phẩm", to: "/danh-sach-san-pham" },
    { name: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BreadCrumb paths={breadcrumbPaths} />

      {/* Grid chính */}
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Ảnh */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ImageCarousel images={images} />
        </div>

        {/* Thông tin sản phẩm */}
        <ProductInfo
          product={product}
          specs={specs}
          showAddToCart={true}
          onShowSpecs={() => setShowSpecModal(true)}
        />
      </div>

      {/* Modal thông số */}
      <SpecModal
        specs={specs}
        isOpen={showSpecModal}
        onClose={() => setShowSpecModal(false)}
      />

      {/* Reviews */}
      <div className="mt-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <ReviewForm onSubmit={handleAddReview} />
        </div>
        <ReviewSummary reviews={reviews} />
      </div>

      <div className="mt-12">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default memo(ProductDetail);
