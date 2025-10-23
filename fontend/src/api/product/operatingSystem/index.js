import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const osAPI = createCRUD("/operating-systems");

export const useOperatingSystems = (options) =>
  useGetAll("operating-systems", osAPI.getAll, options);

export const useCreateOperatingSystem = (options) =>
  useMutate("operating-systems", osAPI.create, options);

export const useUpdateOperatingSystem = (options) =>
  useMutate("operating-systems", osAPI.update, options);

export const useDeleteOperatingSystem = (options) =>
  useMutate("operating-systems", osAPI.delete, options);
