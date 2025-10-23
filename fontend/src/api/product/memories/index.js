// src/api/product/memories.js
import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const memoriesAPI = createCRUD("/memories"); 

export const useMemories = (options) => useGetAll("memories", memoriesAPI.getAll, options);

export const useCreateMemory = (options) => useMutate("memories", memoriesAPI.create, options);
export const useUpdateMemory = (options) => useMutate("memories", memoriesAPI.update, options);
export const useDeleteMemory = (options) => useMutate("memories", memoriesAPI.delete, options);
