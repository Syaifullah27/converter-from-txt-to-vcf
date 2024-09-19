/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const app = express();

// Menghubungkan ke MongoDB
mongoose.connect('mongodb://localhost:27017/AUTH', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000', // Izinkan hanya request dari front-end di port 3000
  methods: ['GET', 'POST'], // Izinkan metode GET dan POST
  credentials: true // Izinkan credentials seperti cookies
}));

// Middleware untuk JSON request
app.use(express.json());

// Rute untuk autentikasi
app.use('/api/auth', authRoutes);

// Menjalankan server
app.listen(5001, () => {
  console.log('Server running on port 5001');
});
