import api from "../axios";

const END_POINT = {
  BRANDS: "/brands",
};

// Get all brands
export const getBrandsAPI = async () => {
  try {
    const response = await api.get(END_POINT.BRANDS);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Get brand by ID
export const getBrandByIdAPI = async (id) => {
  try {
    const response = await api.get(`${END_POINT.BRANDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand ${id}:`, error);
    throw error;
  }
};

// Create new brand (support image upload)
export const createBrandAPI = async (data) => {
  try {
    let payload = data;

    if (!(data instanceof FormData)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      payload = formData;
    }

    const response = await api.post(END_POINT.BRANDS, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

// Update brand (support image upload)
export const updateBrandAPI = async (id, data) => {
   try {
    let payload = data;

    if (!(data instanceof FormData)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      payload = formData;
    }

    const response = await api.post(`${END_POINT.BRANDS}/${id}?_method=PUT`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating brand ${id}:`, error);
    throw error;
  }
};

//  Delete brand
export const deleteBrandAPI = async (id) => {
  try {
    const response = await api.delete(`${END_POINT.BRANDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand ${id}:`, error);
    throw error;
  }
};
