// src/index.ts

// Initialize Environment Variables


import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import redisClient from './redisClient';

// Import Routes
import userRoutes from './routes/users';
import endpointsRoutes from './routes/endpoints';
import dynmaicRoutes from './routes/dynamic';
import healthRoutes from './routes/health'

const envFile = process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

import './config/passportConfig';

// Initialize Express App
const app: Application = express();

// Middleware
app.use(
  cors({
    origin: "https://mockable.dev",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/mockify_io_db';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/users', userRoutes);
app.use("/api/endpoints", endpointsRoutes);
app.use("/api", dynmaicRoutes);
app.use("/api/health", healthRoutes)

// Start the Server
const PORT: number = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Updated Correctly")
});

process.on('SIGINT', () => {
  redisClient.quit(() => {
      console.log('Redis client disconnected');
      process.exit(0);
  });
});
