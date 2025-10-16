import api from "../../axios";

const END_POINT = {
  ACCOUNT_TYPE: "/account-types", // API endpoint for account types
};

// Get all account types
export const getAccountTypeAPI = async () => {
  try {
    const response = await api.get(END_POINT.ACCOUNT_TYPE);
    return response.data;
  } catch (error) {
    console.error("Error fetching account types:", error);
    throw error;
  }
};

// Create a new account type
export const createAccountTypeAPI = async (data) => {
  const res = await api.post(END_POINT.ACCOUNT_TYPE, data);
  return res.data;
};

// Update an existing account type
export const updateAccountTypeAPI = async (id, data) => {
  const res = await api.put(`${END_POINT.ACCOUNT_TYPE}/${id}`, data);
  return res.data;
};

// Delete an account type
export const deleteAccountTypeAPI = async (id) => {
  await api.delete(`${END_POINT.ACCOUNT_TYPE}/${id}`);
  return id;
};
