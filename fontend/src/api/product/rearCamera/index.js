// src/api/product/rearCamera.js

import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const rearCamerasAPI = createCRUD("/rear-cameras");

export const useRearCameras = (options) =>
  useGetAll("rear-cameras", rearCamerasAPI.getAll, options);

export const useCreateRearCamera = (options) =>
  useMutate("rear-cameras", rearCamerasAPI.create, options);

export const useUpdateRearCamera = (options) =>
  useMutate("rear-cameras", rearCamerasAPI.update, options);

export const useDeleteRearCamera = (options) =>
  useMutate("rear-cameras", rearCamerasAPI.delete, options);
