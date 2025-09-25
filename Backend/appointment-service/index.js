import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Appointment service running on port ${PORT}`));
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
