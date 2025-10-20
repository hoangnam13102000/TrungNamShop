import api from "../axios";

const END_POINT = {
  CUSTOMERS: "/customers",
};

export const getCustomersAPI = async () => {
  try {
    const response = await api.get(END_POINT.CUSTOMERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// View
export const getCustomerByIdAPI = async (id) => {
  try {
    const response = await api.get(`${END_POINT.CUSTOMERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

// Create
export const createCustomerAPI = async (data) => {
  try {
    const response = await api.post(END_POINT.CUSTOMERS, data);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update
export const updateCustomerAPI = async (id, data) => {
  try {
    const response = await api.put(`${END_POINT.CUSTOMERS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

// Delete
export const deleteCustomerAPI = async (id) => {
  try {
    await api.delete(`${END_POINT.CUSTOMERS}/${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};
