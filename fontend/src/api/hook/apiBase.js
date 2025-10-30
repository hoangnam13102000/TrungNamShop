import api from "../axios";

const isFile = (value) => value instanceof File || value instanceof Blob;

const toFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && !isFile(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};

/** API CRUD generator ( RESTful) */
export const createCRUD = (endpoint) => ({
  /** Get List */
  getAll: async () => {
    const res = await api.get(endpoint);
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    return res.data?.data ?? [];
  },

  /** get record*/
  getOne: async (id) => {
    const res = await api.get(`${endpoint}/${id}`);
    return res.data?.data ?? res.data;
  },

  /** Create */
  create: async (data) => {
    const hasFile = Object.values(data).some(isFile);
    const payload = hasFile ? toFormData(data) : data;

    const res = await api.post(
      endpoint,
      payload,
      hasFile
        ? {
            headers: { "Content-Type": "multipart/form-data" },
          }
        : undefined
    );

    return res.data?.data ?? res.data;
  },

  /** Update */
  update: async (id, data) => {
  if (!id) throw new Error(" Missing ID for update");
  if (!data) throw new Error(" update() called with undefined data");

  const hasFile = Object.values(data).some(isFile);
  const payload = hasFile ? toFormData(data) : data;

  const res = await api.post(
    `${endpoint}/${id}?_method=PUT`,
    payload,
    hasFile
      ? {
          headers: { "Content-Type": "multipart/form-data" },
        }
      : undefined
  );

  return res.data?.data ?? res.data;
},

  /** Delete */
  delete: async (id) => {
    const res = await api.delete(`${endpoint}/${id}`);
    return res.data ?? id;
  },
});
