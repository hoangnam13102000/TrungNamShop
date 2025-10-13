import api from "../../axios";

const END_POINT = {
  PROMOTIONS: "/promotions",
};

export const getPromotionsAPI = async () => {
  try {
    const response = await api.get(END_POINT.PROMOTIONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const createPromotionAPI = async (data) => {
  const res = await api.post(END_POINT.PROMOTIONS, data);
  return res.data;
};

export const updatePromotionAPI = async (id, data) => {
  const res = await api.put(`${END_POINT.PROMOTIONS}/${id}`, data);
  return res.data;
};

export const deletePromotionAPI = async (id) => {
  await api.delete(`${END_POINT.PROMOTIONS}/${id}`);
  return id;
};
