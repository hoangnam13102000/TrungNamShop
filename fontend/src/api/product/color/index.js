
import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const colorsAPI = createCRUD("/colors");

export const useColors = (options) => useGetAll("colors", colorsAPI.getAll, options);

export const useCreateColor = (options) => useMutate("colors", colorsAPI.create, options);
export const useUpdateColor = (options) => useMutate("colors", colorsAPI.update, options);
export const useDeleteColor = (options) => useMutate("colors", colorsAPI.delete, options);
