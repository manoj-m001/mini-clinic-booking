const express = require('express');
const { bookSlot, getMyBookings, getAllBookings } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/book', protect, authorize('patient'), bookSlot);
router.get('/my-bookings', protect, authorize('patient'), getMyBookings);
router.get('/all-bookings', protect, authorize('admin'), getAllBookings);

module.exports = router;

