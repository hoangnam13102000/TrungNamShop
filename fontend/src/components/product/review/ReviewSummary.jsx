import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewSummary = ({ reviews = [], productId }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-gray-500">Chưa có đánh giá nào</p>
      </div>
    );
  }

  // Lọc review theo productId
  const filteredReviews = productId
    ? reviews.filter((r) => r.product_id === productId)
    : reviews;

  if (filteredReviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
      </div>
    );
  }

  // Tính trung bình
  const average =
    filteredReviews.reduce((sum, r) => sum + r.stars, 0) / filteredReviews.length;
  const roundedAvg = Math.round(average * 2) / 2; // làm tròn 0.5

  // Thống kê số lượng từng sao
  const starCounts = [0, 0, 0, 0, 0]; // index 0 -> 1 sao
  filteredReviews.forEach(r => {
    if (r.stars >= 1 && r.stars <= 5) starCounts[r.stars - 1]++;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Trung bình và tổng */}
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((star, i) => {
            if (star <= Math.floor(roundedAvg)) return <FaStar key={i} className="text-yellow-400" />;
            if (star - 0.5 === roundedAvg) return <FaStar key={i} className="text-yellow-400/50" />;
            return <FaRegStar key={i} className="text-gray-300" />;
          })}
        </div>
        <p className="text-3xl font-bold">{average.toFixed(1)}</p>
        <p className="text-gray-500">{filteredReviews.length} đánh giá</p>
      </div>

      {/* Thống kê từng sao */}
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = starCounts[star - 1];
          const percentage = (count / filteredReviews.length) * 100;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-6 text-sm">{star}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-3"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSummary;
