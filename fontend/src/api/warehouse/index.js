import { createCRUD } from "../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";


const warehousesAPI = createCRUD("/warehouses");

export const useWarehouses = (options) => useGetAll("warehouses", warehousesAPI.getAll, options);

export const useCreateWarehouse = (options) => useMutate("warehouses",warehousesAPI.create, options);
export const useUpdateWarehouse = (options) => useMutate("warehouses", warehousesAPI.update, options);
export const useDeleteWarehouse = (options) => useMutate("warehouses", warehousesAPI.delete, options);