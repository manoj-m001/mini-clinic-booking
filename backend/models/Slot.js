const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slot', SlotSchema);