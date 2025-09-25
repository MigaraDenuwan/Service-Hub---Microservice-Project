const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const providerRoutes = require('./routes/providerRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const connectDB = require('./config/db');
connectDB();

app.use('/api/providers', providerRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Provider Service running on port ${PORT}`));
