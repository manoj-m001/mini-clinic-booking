const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        error: {
          code: "SLOT_NOT_FOUND",
          message: "Slot not found",
        },
      });
    }

    const existingBooking = await Booking.findOne({ slotId });

    if (existingBooking) {
      return res.status(400).json({
        error: {
          code: "SLOT_TAKEN",
          message: "This slot is already booked",
        },
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      slotId,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("slotId")
      .sort("-createdAt");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("slotId")
      .populate("userId", "name email")
      .sort("-createdAt");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
};

export { getAllBookings, bookSlot, getMyBookings };
