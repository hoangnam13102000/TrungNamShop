
import { createCRUD } from "../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";


const brandsAPI = createCRUD("/brands");

export const useBrands = (options) => useGetAll("brands", brandsAPI.getAll, options);

export const useCreateBrand = (options) => useMutate("brands", brandsAPI.create, options);
export const useUpdateBrand = (options) => useMutate("brands", brandsAPI.update, options);
export const useDeleteBrand = (options) => useMutate("brands", brandsAPI.delete, options);
