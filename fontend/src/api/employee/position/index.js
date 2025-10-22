import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const positionsAPI = createCRUD("/positions");

export const usePositions = (options) => useGetAll("positions", positionsAPI.getAll, options);

export const useCreatePosition = (options) => useMutate("positions", positionsAPI.create, options);
export const useUpdatePosition = (options) => useMutate("positions", positionsAPI.update, options);
export const useDeletePosition = (options) => useMutate("positions", positionsAPI.delete, options);