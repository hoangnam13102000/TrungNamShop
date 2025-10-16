import api from "../../axios";

const END_POINT = {
  ACCOUNT_LEVELING: "/account-leveling", // endpoint API cho account leveling
};

// Lấy danh sách account leveling
export const getAccountLevelingAPI = async () => {
  try {
    const response = await api.get(END_POINT.ACCOUNT_LEVELING);
    return response.data;
  } catch (error) {
    console.error("Error fetching account leveling:", error);
    throw error;
  }
};

// Tạo account leveling mới
export const createAccountLevelingAPI = async (data) => {
  const res = await api.post(END_POINT.ACCOUNT_LEVELING, data);
  return res.data;
};

// Cập nhật account leveling
export const updateAccountLevelingAPI = async (id, data) => {
  const res = await api.put(`${END_POINT.ACCOUNT_LEVELING}/${id}`, data);
  return res.data;
};

// Xoá account leveling
export const deleteAccountLevelingAPI = async (id) => {
  await api.delete(`${END_POINT.ACCOUNT_LEVELING}/${id}`);
  return id;
};
