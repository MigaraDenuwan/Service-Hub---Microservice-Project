import express from 'express';
import {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - userEmail
 *         - serviceId
 *         - appointmentDate
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the appointment
 *         userEmail:
 *           type: string
 *           description: Email of the user booking the appointment
 *         serviceId:
 *           type: string
 *           description: ID of the service for the appointment
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the appointment
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *           description: Status of the appointment
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Bad request
 */
router.post('/', bookAppointment);

/**
 * @swagger
 * /api/appointments/cancel/{id}:
 *   put:
 *     summary: Cancel an existing appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the appointment to cancel
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       404:
 *         description: Appointment not found
 */
router.put('/cancel/:id', cancelAppointment);

/**
 * @swagger
 * /api/appointments/reschedule/{id}:
 *   put:
 *     summary: Reschedule an existing appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the appointment to reschedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Appointment rescheduled successfully
 */
router.put('/reschedule/:id', rescheduleAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Retrieve all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/', getAppointments);

export default router;