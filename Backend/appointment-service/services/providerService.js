import axios from 'axios';
import dotenv from 'dotenv';
import { getServiceUrl } from '../eureka-client.js';
dotenv.config();

// Helper to dynamically get provider URL, fallback to ENV
const getProviderUrl = () => {
  const dynamicUrl = getServiceUrl('provider-service');
  return dynamicUrl || process.env.PROVIDER_SERVICE_URL || 'http://localhost:5001';
};

export const checkProviderAvailability = async (providerId, date, time) => {
  try {
    const baseUrl = getProviderUrl();
    console.log(`[Discovery] Calling Provider Service at ${baseUrl}`);
    const response = await axios.get(`${baseUrl}/api/providers/check-availability`, {
      params: { providerId, date, time }
    });
    return response.data.available;
  } catch (error) {
    console.error('Error contacting Provider Service:', error.message);
    throw new Error('Provider Service is currently unavailable.');
  }
};

export const bookProviderSlot = async (appointmentData) => {
  try {
    const baseUrl = getProviderUrl();
    const response = await axios.post(`${baseUrl}/api/providers/book-appointment`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error booking provider slot:', error.message);
    throw new Error('Failed to book provider slot.');
  }
};
