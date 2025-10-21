import { createCRUD } from "../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";


const storesAPI = createCRUD("/stores");

export const useStores = (options) => useGetAll("stores", storesAPI.getAll, options);

export const useCreateStore = (options) => useMutate("stores",storesAPI.create, options);
export const useUpdateStore = (options) => useMutate("stores", storesAPI.update, options);
export const useDeleteStore = (options) => useMutate("stores", storesAPI.delete, options);