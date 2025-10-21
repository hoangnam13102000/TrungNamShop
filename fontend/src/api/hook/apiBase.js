import api from "../axios";

const isFile = (value) => value instanceof File || value instanceof Blob;

const toFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

export const createCRUD = (endpoint) => ({
  getAll: async () => {
    const res = await api.get(endpoint);
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    return [];
  },

  getOne: async (id) => {
    const res = await api.get(`${endpoint}/${id}`);
    return res.data.data ?? res.data;
  },

  create: async (data) => {
    // Check if exist file => use FormData
    const hasFile = Object.values(data).some(isFile);
    const payload = hasFile ? toFormData(data) : data;

    const res = await api.post(endpoint, payload, hasFile ? {
      headers: { "Content-Type": "multipart/form-data" }
    } : undefined);

    return res.data.data ?? res.data;
  },

  update: async (id, data) => {
    const hasFile = Object.values(data).some(isFile);
    const payload = hasFile ? toFormData(data) : data;

    const res = await api.put(`${endpoint}/${id}`, payload, hasFile ? {
      headers: { "Content-Type": "multipart/form-data" }
    } : undefined);

    return res.data.data ?? res.data;
  },

  delete: async (id) => {
    await api.delete(`${endpoint}/${id}`);
    return id;
  },
});
