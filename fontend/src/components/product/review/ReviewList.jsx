import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewList = ({ reviews }) => (
  <div className="space-y-4">
    {reviews.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      </div>
    ) : (
      reviews.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{r.name}</h4>
              <p className="text-sm text-gray-500">{r.date}</p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) =>
                i < r.stars ? (
                  <FaStar key={i} className="text-yellow-400" size={14} />
                ) : (
                  <FaRegStar key={i} className="text-gray-300" size={14} />
                )
              )}
            </div>
          </div>
          <p className="text-gray-700">{r.content}</p>
        </div>
      ))
    )}
  </div>
);

export default ReviewList;
