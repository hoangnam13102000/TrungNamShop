import api from "../../axios";

const END_POINT = {
  REWARDS: "/rewards",
};

export const getRewardsAPI = async () => {
  try {
    const response = await api.get(END_POINT.REWARDS);
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
};

export const createRewardAPI = async (data) => {
  const res = await api.post(END_POINT.REWARDS, data);
  return res.data;
};


export const updateRewardAPI = async (id, data) => {
  const res = await api.put(`${END_POINT.REWARDS}/${id}`, data);
  return res.data;
};


export const deleteRewardAPI = async (id) => {
  await api.delete(`${END_POINT.REWARDS}/${id}`);
  return id;
};
