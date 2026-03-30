import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  providerId: { type: String, required: true },
  date: { type: String, required: true }, // Mongoose doesn't have DATEONLY, use String or Date
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['BOOKED', 'CANCELLED', 'RESCHEDULED'],
    default: 'BOOKED'
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
