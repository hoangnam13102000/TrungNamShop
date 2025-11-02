import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const reviewsAPI = createCRUD("/reviews");

export const useReviews = (options) => useGetAll("reviews", reviewsAPI.getAll, options);
export const useCreateReview = (options) => useMutate("reviews", reviewsAPI.create, options);
export const useUpdateReview = (options) => useMutate("reviews", reviewsAPI.update, options);
export const useDeleteReview = (options) => useMutate("reviews", reviewsAPI.delete, options);

// export const useRestoreReview = (options) =>
//   useMutate("reviews", (id, data) => fetch(`/reviews/restore/${id}`, { method: "GET", body: JSON.stringify(data) }).then(res => res.json()), options);

// export const useToggleReviewStatus = (options) =>
//   useMutate("reviews", (id) => fetch(`/reviews/toggle-status/${id}`, { method: "GET" }).then(res => res.json()), options);
