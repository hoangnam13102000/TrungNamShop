import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const promotionsAPI = createCRUD("/promotions");

export const usePromotions = (options) => useGetAll("promotions", promotionsAPI.getAll, options);

export const useCreatePromotion = (options) => useMutate("promotions", promotionsAPI.create, options);
export const useUpdatePromotion = (options) => useMutate("promotions", promotionsAPI.update, options);
export const useDeletePromotion = (options) => useMutate("promotions", promotionsAPI.delete, options);