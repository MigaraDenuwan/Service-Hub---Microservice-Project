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
    res.status(201).json(appointment);
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'CANCELLED';
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const isAvailable = await checkProviderAvailability(appointment.providerId, date, time);
    if (!isAvailable) return res.status(400).json({ message: 'New time not available' });

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'RESCHEDULED';
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

export const getAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
