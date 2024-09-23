/* eslint-disable no-undef */
const prisma = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

// Registrasi pengguna
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prismaClient.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat registrasi', error });
  }
};

// Login pengguna
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat login', error });
  }
};
