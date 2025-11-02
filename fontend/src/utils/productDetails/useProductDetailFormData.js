import { useQuery } from "@tanstack/react-query";
import { createCRUD } from "../../api/hook/apiBase";

const productsAPI = createCRUD("/products");
const screensAPI = createCRUD("/screens");
const memoriesAPI = createCRUD("/memories");
const frontCamerasAPI = createCRUD("/front-cameras");
const rearCamerasAPI = createCRUD("/rear-cameras");
const operatingSystemsAPI = createCRUD("/operating-systems");
const utilitiesAPI = createCRUD("/utilities");
const batteriesAPI = createCRUD("/batteries-charging");
const connectivitiesAPI = createCRUD("/communication-connectivities");
const generalInfosAPI = createCRUD("/general-informations");

export const useProductDetailFormData = () => {
  return useQuery({
    queryKey: ["product-detail-form-data"],
    queryFn: async () => {
      const [
        products,
        screens,
        memories,
        frontCameras,
        rearCameras,
        operatingSystems,
        utilities,
        batteries,
        connectivities,
        generalInfos,
      ] = await Promise.all([
        productsAPI.getAll(),
        screensAPI.getAll(),
        memoriesAPI.getAll(),
        frontCamerasAPI.getAll(),
        rearCamerasAPI.getAll(),
        operatingSystemsAPI.getAll(),
        utilitiesAPI.getAll(),
        batteriesAPI.getAll(),
        connectivitiesAPI.getAll(),
        generalInfosAPI.getAll(),
      ]);

      return {
        products,
        screens,
        memories,
        frontCameras,
        rearCameras,
        operatingSystems,
        utilities,
        batteries,
        connectivities,
        generalInfos,
      };
    },
    staleTime: 10 * 60 * 1000, // cache 10 minutes
  });
};
