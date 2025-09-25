import axios from 'axios';
import { Provider } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const providerApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
providerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// For demonstration purposes - remove in production
const mockProviders = [
  {
    _id: '1',
    name: 'Clean Home Services',
    serviceType: 'Cleaning',
    address: '123 Main St, Anytown',
    phone: '(555) 123-4567',
    isVerified: true,
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' },
    ],
    reviews: [
      { userId: 'user1', rating: 5, comment: 'Excellent service!', createdAt: '2023-04-15T14:30:00Z' },
      { userId: 'user2', rating: 4, comment: 'Very good, would recommend.', createdAt: '2023-03-22T10:15:00Z' },
      { userId: 'user3', rating: 5, comment: 'Professional and thorough.', createdAt: '2023-02-08T16:45:00Z' },
    ],
  },
  // ... other providers (already defined in the Providers component)
];

export const getProviders = async () => {
  try {
    const response = await providerApi.get<Provider[]>('/providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    // Return mock data for demonstration
    return mockProviders;
  }
};

export const getProviderById = async (id: string) => {
  try {
    const response = await providerApi.get<Provider>(`/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching provider with ID ${id}:`, error);
    // Return mock data for demonstration
    return mockProviders.find(p => p._id === id) || null;
  }
};

export const updateAvailability = async (id: string, availability: { day: string; startTime: string; endTime: string }[]) => {
  try {
    const response = await providerApi.put<Provider>(`/providers/${id}/availability`, { availability });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update availability');
    }
    throw new Error('Unable to connect to the server');
  }
};

export const verifyProvider = async (id: string) => {
  try {
    const response = await providerApi.put<Provider>(`/providers/${id}/verify`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to verify provider');
    }
    throw new Error('Unable to connect to the server');
  }
};

export const addProvider = async (provider: {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
}) => {
  try {
    const response = await providerApi.post('/providers/', provider);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add provider');
    }
    throw new Error('Unable to connect to the server');
  }
};


export const addReview = async (providerId: string, reviewData: { userId: string; rating: number; comment: string }) => {
  try {
    const response = await axios.post(`${API_URL}/providers/${providerId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw new Error('Failed to add review');
  }
};

export const checkProviderAvailability = async (providerId: string, date: string, time: string) => {
  try {
    const response = await axios.get(`${API_URL}/providers/check-availability`, {
      params: { providerId, date, time }
    });
    return response.data.available;
  } catch (error) {
    console.error('Error checking availability:', error);
    // For demonstration, return a simulated response
    return Math.random() > 0.3; // 70% chance of being available
  }
};

export const getProviderByEmail = async (email: string) => {
  const res = await axios.get(`${API_URL}/providers/by-email`, {
    params: { email },
  });
  return res.data;
};