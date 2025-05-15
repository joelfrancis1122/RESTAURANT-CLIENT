import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/restaurants`;

export const getAllRestaurants = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addRestaurant = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateRestaurant = async (id, data) => {
  const response = await axios.put(`${API_URL}?id=${id}`, data);
  return response.data;
};

export const deleteRestaurant = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
