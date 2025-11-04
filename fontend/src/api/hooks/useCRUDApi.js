import { createCRUD } from "./apiBase";
import { useGetAll, useMutate } from "./useBaseQuery";

/**
 * Tạo CRUDApi cho 1 resource bất kỳ
 * @param {string} resource - tên resource, ví dụ 'products'
 */
export const useCRUDApi = (resource) => {
  const api = createCRUD(`/${resource}`);

  return {
    useGetAll: (options) => useGetAll(resource, api.getAll, options),
    useCreate: (options) => useMutate(resource, api.create, options),
    useUpdate: (options) => useMutate(resource, api.update, options),
    useDelete: (options) => useMutate(resource, api.delete, options),
  };
};
