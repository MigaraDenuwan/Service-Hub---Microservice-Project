import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import setupSwagger from './config/swagger.js';


// Import and initialize Eureka client
import './eureka-client.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Setup Swagger
setupSwagger(app);


// Health Check Endpoint for Eureka
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Appointment service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
