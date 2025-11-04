import { useCRUDApi } from "../../../api/hooks/useCRUDApi";

// ===================== PRODUCT =====================
export const useProducts = () => useCRUDApi("products");

// ===================== SCREEN =====================
export const useScreens = () => useCRUDApi("screens");

// ===================== FRONT CAMERA =====================
export const useFrontCameras = () => useCRUDApi("frontCameras");

// ===================== REAR CAMERA =====================
export const useRearCameras = () => useCRUDApi("rearCameras");

// ===================== MEMORY =====================
export const useMemories = () => useCRUDApi("memories");

// ===================== OPERATING SYSTEM =====================
export const useOperatingSystems = () => useCRUDApi("operatingSystems");

// ===================== UTILITY =====================
export const useUtilities = () => useCRUDApi("utilities");

// ===================== BATTERY CHARGING =====================
export const useBatteriesCharging  = () => useCRUDApi("batteries-charging");

// ===================== GENERAL INFORMATION =====================
export const useGeneralInformations = () => useCRUDApi("general-informations");

// ===================== COMMUNICATION CONNECTIVITY =====================
export const useCommunicationConnectivities = () => useCRUDApi("communicationConnectivities");

// ===================== PRODUCT DETAIL =====================
export const useProductDetails = () => useCRUDApi("productDetails");
