import api from './api';

export const roommateService = {
  searchRoommates: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.minAge) params.append('minAge', filters.minAge);
    if (filters.maxAge) params.append('maxAge', filters.maxAge);
    if (filters.occupation) params.append('occupation', filters.occupation);
    if (filters.preferredCity) params.append('preferredCity', filters.preferredCity);
    if (filters.roomType) params.append('roomType', filters.roomType);
    if (filters.minBudget) params.append('minBudget', filters.minBudget);
    if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);

    const response = await api.get(`/roommates?${params.toString()}`);
    return response.data;
  },
  createRoommateAd: async (adData) => {
    const response = await api.post('/roommates', adData);
    return response.data;
  },
  updateRoommateAd: async (id, adData) => {
    const response = await api.put(`/roommates/${id}`, adData);
    return response.data;
  },
  deleteRoommateAd: async (id) => {
    await api.delete(`/roommates/${id}`);
  }
};
