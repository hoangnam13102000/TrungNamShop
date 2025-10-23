import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const screensAPI = createCRUD("/screens");

export const useScreens = (options) =>
  useGetAll("screens", screensAPI.getAll, options);

export const useCreateScreen = (options) =>
  useMutate("screens", screensAPI.create, options);

export const useUpdateScreen = (options) =>
  useMutate("screens", screensAPI.update, options);

export const useDeleteScreen = (options) =>
  useMutate("screens", screensAPI.delete, options);
