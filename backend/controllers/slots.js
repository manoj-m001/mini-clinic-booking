const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

const generateSlots = async (startDate) => {
  const slots = [];
  const startHour = 9; 
  const endHour = 17; 
  const slotDuration = 30; 
  
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startAt = new Date(currentDate);
        startAt.setHours(hour, minute, 0, 0);
        
        const endAt = new Date(startAt);
        endAt.setMinutes(endAt.getMinutes() + slotDuration);
        
        const existingSlot = await Slot.findOne({
          startAt: startAt,
          endAt: endAt
        });
        
        if (!existingSlot) {
          slots.push({
            startAt,
            endAt
          });
        }
      }
    }
  }
  
  return slots;
};


const getAvailableSlots = async (req, res) => {
  try {
    const { from, to } = req.query;
    let startDate = from ? new Date(from) : new Date();
    let endDate = to ? new Date(to) : new Date(startDate);
    endDate.setDate(startDate.getDate() + 7); 
    const newSlots = await generateSlots(startDate);
    
    if (newSlots.length > 0) {
      await Slot.insertMany(newSlots);
    }
    
    const slots = await Slot.find({
      startAt: { $gte: startDate },
      endAt: { $lte: endDate }
    }).sort('startAt');
    
    const bookings = await Booking.find({
      slotId: { $in: slots.map(slot => slot._id) }
    });
    
     const bookedSlotIds = bookings.map(booking => booking.slotId.toString());
    const availableSlots = slots.filter(slot => !bookedSlotIds.includes(slot._id.toString()));
    
    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};
export {getAvailableSlots,generateSlots}