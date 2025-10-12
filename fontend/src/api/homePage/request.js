import api from "../axios"; 

const END_POINT = {
  STORES: "/stores",
};

export const getStoresAPI = async () => {
  try {
    const response = await api.get(END_POINT.STORES);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};
export const createStoreAPI = async (data) => {
  const res = await api.post(END_POINT, data);
  return res.data;
};

export const updateStoreAPI = async (id, data) => {
  const res = await api.put(`${END_POINT}/${id}`, data);
  return res.data;
};

export const deleteStoreAPI = async (id) => {
  await api.delete(`${END_POINT}/${id}`);
  return id;
};