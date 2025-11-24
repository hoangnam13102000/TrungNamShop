import api from "../axios";

/** Check if value is File/Blob */
const isFile = (value) => value instanceof File || value instanceof Blob;

/** Convert object → FormData, stringify nested object safely */
const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (isFile(value)) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

/** API CRUD generator (RESTful) */
export const createCRUD = (endpoint) => ({
  /** Get list */
  getAll: async (params) => {
    const res = await api.get(endpoint, { params });
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    return res.data?.data ?? [];
  },

  /** Get single record */
  getOne: async (id) => {
    if (!id) throw new Error("Missing ID for getOne");
    const res = await api.get(`${endpoint}/${id}`);
    return res.data?.data ?? res.data;
  },

  /** Create record */
  create: async (data) => {
    if (!data) throw new Error("create() called with undefined data");

    const hasFile = Object.values(data).some(isFile);
    const payload = hasFile ? toFormData(data) : data;

    const res = await api.post(
      endpoint,
      payload,
      hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );

    return res.data?.data ?? res.data;
  },

  /** Update record */
  update: async (id, data) => {
    if (!id) throw new Error("Missing ID for update");
    if (!data) throw new Error("update() called with undefined data");

    const hasFile = Object.values(data).some(isFile);
    const payload = hasFile ? toFormData(data) : data;

    const res = await api.post(
      `${endpoint}/${id}?_method=PUT`,
      payload,
      hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );

    return res.data?.data ?? res.data;
  },

  /** Delete record */
  delete: async (id) => {
    if (!id) throw new Error("Missing ID for delete");
    const res = await api.delete(`${endpoint}/${id}`);
    return res.data ?? id;
  },
});
