import { createCRUD } from "../../hook/apiBase";
import { useGetAll, useMutate } from "../../hook/useBaseQuery";

const utilitiesAPI = createCRUD("/utilities");

export const useUtilities = (options) =>
  useGetAll("utilities", utilitiesAPI.getAll, options);

export const useCreateUtility = (options) =>
  useMutate("utilities", utilitiesAPI.create, options);

export const useUpdateUtility = (options) =>
  useMutate("utilities", utilitiesAPI.update, options);

export const useDeleteUtility = (options) =>
  useMutate("utilities", utilitiesAPI.delete, options);
