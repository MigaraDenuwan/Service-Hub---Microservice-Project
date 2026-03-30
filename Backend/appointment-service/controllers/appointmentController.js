import Appointment from '../models/appointmentModel.js';
import { checkProviderAvailability } from '../services/providerService.js';

export const bookAppointment = async (req, res) => {
  const { customerId, providerId, date, time } = req.body;

  try {
    const isAvailable = await checkProviderAvailability(providerId, date, time);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Provider not available at the given time.' });
    }

    const appointment = await Appointment.create({ customerId, providerId, date, time });
    
    // Convert to object and rename _id to id for frontend compatibility
    const appointmentObj = appointment.toObject();
    appointmentObj.id = appointmentObj._id.toString();

    res.status(201).json(appointmentObj);
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'CANCELLED';
    await appointment.save();
    
    const appointmentObj = appointment.toObject();
    appointmentObj.id = appointmentObj._id.toString();

    res.json(appointmentObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const isAvailable = await checkProviderAvailability(appointment.providerId, date, time);
    if (!isAvailable) return res.status(400).json({ message: 'New time not available' });

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'RESCHEDULED';
    await appointment.save();
    
    const appointmentObj = appointment.toObject();
    appointmentObj.id = appointmentObj._id.toString();

    res.json(appointmentObj);
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

export const getAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.find();
    
    // Map _id and created/updated to match frontend structure if needed
    const formatted = appointments.map(a => {
      const obj = a.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
