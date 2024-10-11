import axios from 'axios';

const API_URL = 'http://localhost:3002'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default api;