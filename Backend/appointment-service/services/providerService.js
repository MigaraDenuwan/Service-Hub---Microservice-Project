import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const checkProviderAvailability = async (providerId, date, time) => {
  try {
    const response = await axios.get(`${process.env.PROVIDER_SERVICE_URL}/api/providers/check-availability`, {
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
    const response = await axios.post(`${process.env.PROVIDER_SERVICE_URL}/api/providers/book-appointment`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error booking provider slot:', error.message);
    throw new Error('Failed to book provider slot.');
  }
};
