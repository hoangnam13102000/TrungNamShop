import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewSummary = ({ reviews }) => {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Đánh giá tổng thể</h3>
      <div className="text-5xl font-bold text-yellow-500 mb-2">
        {reviews.length > 0 ? avg.toFixed(1) : "—"}
      </div>
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) =>
          i < Math.round(avg) ? (
            <FaStar key={i} className="text-yellow-400" />
          ) : (
            <FaRegStar key={i} className="text-gray-300" />
          )
        )}
      </div>
      <p className="text-gray-600">Từ {reviews.length} đánh giá</p>
    </div>
  );
};

export default ReviewSummary;
