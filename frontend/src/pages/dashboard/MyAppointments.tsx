import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, RefreshCw, X } from 'lucide-react';
import { getAppointments, cancelAppointment, rescheduleAppointment } from '../../services/appointmentService';
import { Appointment } from '../../types';
import { toast } from 'react-toastify';

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // For demo purposes, we'll use the mock data returned by the service
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        setAppointments(appointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'CANCELLED' } 
            : appointment
        ));
        toast.success('Appointment cancelled successfully');
      } catch {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const openRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const handleReschedule = async () => {
    if (!selectedAppointment) return;
    
    try {
      await rescheduleAppointment(selectedAppointment.id, { date: newDate, time: newTime });
      setAppointments(appointments.map(appointment => 
        appointment.id === selectedAppointment.id 
          ? { ...appointment, date: newDate, time: newTime, status: 'RESCHEDULED' } 
          : appointment
      ));
      setShowRescheduleModal(false);
      toast.success('Appointment rescheduled successfully');
    } catch {
      toast.error('Failed to reschedule appointment');
    }
  };

  const today = new Date();
  const upcomingAppointments = appointments.filter(appointment => 
    (appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED') && 
    new Date(`${appointment.date}T${appointment.time}`) >= today
  );
  
  const pastAppointments = appointments.filter(appointment => 
    appointment.status === 'COMPLETED' || 
    appointment.status === 'CANCELLED' ||
    new Date(`${appointment.date}T${appointment.time}`) < today
  );

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'upcoming' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'past' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ) : displayAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {activeTab === 'upcoming' 
              ? 'No upcoming appointments' 
              : 'No past appointments'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'upcoming' 
              ? 'You don\'t have any upcoming appointments scheduled.' 
              : 'You don\'t have any past appointment history.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link
              to="/providers"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Find Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.providerName}
                    </h3>
                    <p className="text-indigo-600">{appointment.serviceType}</p>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium 
                    ${appointment.status === 'BOOKED' ? 'bg-green-100 text-green-800' : ''}
                    ${appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    ${appointment.status === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${appointment.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {appointment.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-800">
                        {format(new Date(appointment.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-800">
                        {format(new Date(`2000-01-01T${appointment.time}`), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'upcoming' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openRescheduleModal(appointment)}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
                
                {activeTab === 'past' && appointment.status === 'COMPLETED' && (
                  <Link
                    to={`/providers/${appointment.providerId}`}
                    className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Leave a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Reschedule Appointment
              </h3>
              <button 
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {selectedAppointment.providerName}
                </h4>
                <p className="text-gray-600">{selectedAppointment.serviceType}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;