/* eslint-disable no-undef */
const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateInput } = require('../middlewares/validateInput');

const router = express.Router();

router.post('/register', validateInput, register);
router.post('/login', validateInput, login);

module.exports = router;
