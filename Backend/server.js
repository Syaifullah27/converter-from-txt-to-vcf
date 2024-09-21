/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/Users'); // Import model User

const app = express();

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/AUTH', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Cek apakah username sudah ada di database
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            console.log('Username already exists');
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Simpan user baru
        const newUser = new User({ username, password });
        await newUser.save();
        console.log('User registered successfully');
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Error occurred during registration:', err);
        return res.status(500).json({ message: 'Error occurred during registration' });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cari user berdasarkan username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).json({ message: 'Username not found' });
        }

        // Periksa apakah password cocok
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        console.log('Login successful');
        return res.status(200).json({ message: 'Login successful' });

    } catch (err) {
        console.error('Error occurred during login:', err);
        return res.status(500).json({ message: 'Error occurred during login' });
    }
});

// Jalankan server
app.listen(5001, () => {
    console.log('Server running on port 5001');
});
