import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const communicationAPI = createCRUD("/communication-connectivities");

export const useCommunicationConnectivities = (options) =>
  useGetAll("communication-connectivities", communicationAPI.getAll, options);

export const useCreateCommunicationConnectivity = (options) =>
  useMutate("communication-connectivities", communicationAPI.create, options);

export const useUpdateCommunicationConnectivity = (options) =>
  useMutate("communication-connectivities", communicationAPI.update, options);

export const useDeleteCommunicationConnectivity = (options) =>
  useMutate("communication-connectivities", communicationAPI.delete, options);
