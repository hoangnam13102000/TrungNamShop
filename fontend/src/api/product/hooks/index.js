import { useCRUDApi } from "../../../api/hooks/useCRUDApi";

// ===================== PRODUCT =====================
export const useProducts = () => useCRUDApi("products").useGetAll();

// ===================== SCREEN =====================
export const useScreens = () => useCRUDApi("screens").useGetAll();

// ===================== FRONT CAMERA =====================
export const useFrontCameras = () => useCRUDApi("front-cameras").useGetAll();

// ===================== REAR CAMERA =====================
export const useRearCameras = () => useCRUDApi("rear-cameras").useGetAll();

// ===================== MEMORY =====================
export const useMemories = () => useCRUDApi("memories").useGetAll();

// ===================== OPERATING SYSTEM =====================
export const useOperatingSystems = () => useCRUDApi("operating-systems").useGetAll();

// ===================== UTILITY =====================
export const useUtilities = () => useCRUDApi("utilities").useGetAll();

// ===================== BATTERY CHARGING =====================
export const useBatteriesCharging  = () => useCRUDApi("batteries-charging").useGetAll();

// ===================== GENERAL INFORMATION =====================
export const useGeneralInformations = () => useCRUDApi("general-informations").useGetAll();

// ===================== COMMUNICATION CONNECTIVITY =====================
export const useCommunicationConnectivities = () => useCRUDApi("communication-connectivities").useGetAll();

// ===================== PRODUCT DETAIL =====================
export const useProductDetails = () => useCRUDApi("product-details").useGetAll();
