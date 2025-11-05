import { FaStar, FaRegStar } from "react-icons/fa";
import { useState } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";

const ReviewForm = ({ productId, accountId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const { useCreate } = useCRUDApi("reviews");
  const createReview = useCreate();

  const [dialog, setDialog] = useState({ open: false, mode: "alert", title: "", message: "" });

  const showDialog = (mode, title, message) => setDialog({ open: true, mode, title, message });
  const closeDialog = () => setDialog(prev => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;

    const payload = { product_id: productId, account_id: accountId || 1, stars: rating, content: comment.trim() };

    try {
      const newReview = await createReview.mutateAsync(payload);
      setComment("");
      setRating(0);
      showDialog("success", "Đánh giá thành công!", "Cảm ơn bạn đã đánh giá sản phẩm!");
      if (onSuccess) onSuccess(newReview); // chỉ update state, không gọi mutate nữa
    } catch (error) {
      console.error("Gửi đánh giá thất bại:", error);
      showDialog("error", "Gửi thất bại", "Không thể gửi đánh giá. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Mức độ hài lòng</label>
          <div className="flex gap-3">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                {star <= (hover || rating) ? (
                  <FaStar size={32} className="text-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
                ) : (
                  <FaRegStar size={32} className="text-gray-300 cursor-pointer hover:scale-110 transition-transform" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Nhận xét của bạn</label>
          <textarea
            className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-yellow-500 resize-none transition-all"
            rows={4}
            placeholder="Hãy chia sẻ cảm nhận của bạn..."
            value={comment}
            onChange={e => setComment(e.target.value)}
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

      <DynamicDialog open={dialog.open} mode={dialog.mode} title={dialog.title} message={dialog.message} onClose={closeDialog} />
    </>
  );
};

export default ReviewForm;
