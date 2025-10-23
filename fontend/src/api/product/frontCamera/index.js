import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const frontCamerasAPI = createCRUD("/front-cameras");

export const useFrontCameras = (options) =>
  useGetAll("front-cameras", frontCamerasAPI.getAll, options);

export const useCreateFrontCamera = (options) =>
  useMutate("front-cameras", frontCamerasAPI.create, options);

export const useUpdateFrontCamera = (options) =>
  useMutate("front-cameras", frontCamerasAPI.update, options);
export const useDeleteFrontCamera = (options) =>
  useMutate("front-cameras", frontCamerasAPI.delete, options);
