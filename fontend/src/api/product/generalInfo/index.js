import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const generalInformationsAPI = createCRUD("/general-informations");

export const useGeneralInformations = (options) =>
  useGetAll("general-informations", generalInformationsAPI.getAll, options);

export const useCreateGeneralInformation = (options) =>
  useMutate("general-informations", generalInformationsAPI.create, options);

export const useUpdateGeneralInformation = (options) =>
  useMutate("general-informations", generalInformationsAPI.update, options);

export const useDeleteGeneralInformation = (options) =>
  useMutate("general-informations", generalInformationsAPI.delete, options);
