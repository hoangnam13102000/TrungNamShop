import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const registerAPI = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginAPI = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

export const logoutAPI = async (token) => {
  const res = await axios.post(
    `${API_URL}/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getCurrentUser = async (token) => {
  const res = await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const checkUsernameExists = async (username) => {
  const res = await axios.post(`${API_URL}/check-username`, { username });
  return res.data.exists; 
};