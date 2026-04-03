const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const providerRoutes = require('./routes/providerRoutes');
const setupSwagger = require('./config/swagger');


// Import and initialize Eureka client
require('./eureka-client');

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost'],
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

const connectDB = require('./config/db');
connectDB();

app.use('/api/providers', providerRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Provider Service running on port ${PORT}`));
