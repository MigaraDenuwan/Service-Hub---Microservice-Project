import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProviderById } from '../services/providerService';
import { bookAppointment } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { format, parse } from 'date-fns';
import { motion } from 'framer-motion';
import { Provider } from '../types';
import { Calendar, Clock, Check, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

interface Appointment {
  customerId: string;
  providerId: string;
  date: string;
  time: string;
}

interface User {
  id: string;
  // add other user properties as needed
}

const AppointmentBooking: React.FC = () => {
  const { providerId } = useParams<{ providerId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) return;

      try {
        const data = await getProviderById(providerId);
        setProvider(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch provider details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  // Generate available times for the selected date
  useEffect(() => {
    if (!selectedDate || !provider) return;

    const dayOfWeek = format(selectedDate, 'EEEE');
    const dayAvailability = provider.availability.filter(slot => slot.day === dayOfWeek);

    if (dayAvailability.length === 0) {
      setAvailableTimes([]);
      return;
    }

    const times: string[] = [];
    dayAvailability.forEach(slot => {
      const startTime = parse(slot.startTime, 'HH:mm', new Date());
      const endTime = parse(slot.endTime, 'HH:mm', new Date());

      let currentTime = startTime;
      while (currentTime < endTime) {
        times.push(format(currentTime, 'HH:mm'));
        currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
      }
    });

    setAvailableTimes(times);
  }, [selectedDate, provider]);

  const handleBookAppointment = async () => {
    if (!providerId || !selectedDate  || !user) return;

    setIsBooking(true);

    try {
      const appointment: Appointment = {
        customerId: (user as User).id || 'user1', // cast user to User type
        providerId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: "03:00:00", // Use a default time for now, can be updated later
      };

      await bookAppointment(appointment);
      setBookingCompleted(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to book appointment');
      }
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const filterDate = (date: Date) => {
    if (!provider) return false;

    const dayOfWeek = format(date, 'EEEE');
    const hasDayAvailability = provider.availability.some(slot => slot.day === dayOfWeek);

    return hasDayAvailability;
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mt-12"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p>{error || 'Provider not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (bookingCompleted) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {provider.name} has been successfully booked for{' '}
              {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at{' '}
              {selectedTime && format(parse(selectedTime, 'HH:mm', new Date()), 'h:mm a')}.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(`/providers/${providerId}`)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md border border-gray-300 transition-colors"
              >
                Back to Provider
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate(`/providers/${providerId}`)}
          className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Provider
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
            <p className="text-gray-600 mt-1">
              with {provider.name} - {provider.serviceType}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <DatePicker
                  selected={selectedDate}
                  onChange={date => {
                    setSelectedDate(date);
                    setSelectedTime('');
                  }}
                  // filterDate={filterDate}
                  minDate={new Date()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholderText="Select a date"
                  dateFormat="MMMM d, yyyy"
                  required
                />
              </div>
              {/* {selectedDate &&  (
                <p className="mt-2 text-sm text-red-600">No available time slots for this date.</p>
              )} */}
            </div>

            {selectedDate && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a time</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>
                        {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || isBooking}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                !selectedDate || isBooking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
