import api from "../axios"; 

const END_POINT = {
  WareHouse: "/warehouses",
};

export const getWarehousesAPI = async () => {
  try {
    const response = await api.get(END_POINT.WareHouse);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};
export const createWarehouseAPI = async (data) => {
  const res = await api.post(END_POINT.WareHouse, data);
  return res.data;
};

export const updateWarehouseAPI = async (id, data) => {
  const res = await api.put(`${END_POINT.WareHouse}/${id}`, data);
  return res.data;
};

export const deleteWarehouseAPI = async (id) => {
  await api.delete(`${END_POINT.WareHouse}/${id}`);
  return id;
};