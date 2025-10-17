import api from "../../axios";

const END_POINT = {
  ACCOUNT: "/accounts", // 👈 endpoint mới cho bảng accounts
};

// Get all accounts
export const getAccountAPI = async () => {
  try {
    const response = await api.get(END_POINT.ACCOUNT);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

// Create a new account
export const createAccountAPI = async (data) => {
  try {
    const res = await api.post(END_POINT.ACCOUNT, data);
    return res.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// Update an existing account
export const updateAccountAPI = async (id, data) => {
  try {
    const res = await api.put(`${END_POINT.ACCOUNT}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

// Delete an account
export const deleteAccountAPI = async (id) => {
  try {
    await api.delete(`${END_POINT.ACCOUNT}/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
