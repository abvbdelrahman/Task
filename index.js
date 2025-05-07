const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const AppError = require('./utils/AppError');
const coursesRouter = require('./routes/couresRouter');

dotenv.config({ path: './.env' });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/courses', coursesRouter);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
