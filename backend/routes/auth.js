const express = require('express');
const { register, login, seedAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/seed-admin', seedAdmin);

module.exports = router;