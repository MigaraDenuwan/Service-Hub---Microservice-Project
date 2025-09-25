import express from 'express';
import {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', bookAppointment);
router.put('/cancel/:id', cancelAppointment);
router.put('/reschedule/:id', rescheduleAppointment);
router.get('/', getAppointments);

export default router;