import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const batteriesChargingAPI = createCRUD("/batteries-charging");

export const useBatteriesCharging = (options) =>
  useGetAll("batteries-charging", batteriesChargingAPI.getAll, options);

export const useCreateBatteryCharging = (options) =>
  useMutate("batteries-charging", batteriesChargingAPI.create, options);

export const useUpdateBatteryCharging = (options) =>
  useMutate("batteries-charging", batteriesChargingAPI.update, options);

export const useDeleteBatteryCharging = (options) =>
  useMutate("batteries-charging", batteriesChargingAPI.delete, options);
