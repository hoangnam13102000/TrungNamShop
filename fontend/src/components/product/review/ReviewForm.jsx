import { FaStar, FaRegStar } from "react-icons/fa";
import { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && rating > 0) {
      onSubmit({ rating, comment });
      setComment("");
      setRating(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Mức độ hài lòng</label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) =>
            star <= (hover || rating) ? (
              <FaStar
                key={star}
                size={32}
                className="text-yellow-400 cursor-pointer hover:scale-110 transition-transform"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ) : (
              <FaRegStar
                key={star}
                size={32}
                className="text-gray-300 cursor-pointer hover:scale-110 transition-transform"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            )
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Nhận xét của bạn</label>
        <textarea
          className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          rows="4"
          placeholder="Hãy chia sẻ cảm nhận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={!comment.trim() || rating === 0}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

export default ReviewForm;
