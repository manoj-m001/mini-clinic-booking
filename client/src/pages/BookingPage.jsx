import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const preselectedSlotId = queryParams.get('slotId');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const today = new Date();
        const fromDate = today.toISOString().split('T')[0];
        
        const toDate = new Date(today);
        toDate.setDate(today.getDate() + 7);
        const toDateStr = toDate.toISOString().split('T')[0];
        
        const res = await axios.get(`/api/slots?from=${fromDate}&to=${toDateStr}`);
        setSlots(res.data);
        
        if (preselectedSlotId) {
          setTimeout(() => {
            const element = document.getElementById(`slot-${preselectedSlotId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        }
      } catch (err) {
        setError('Failed to fetch available slots');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [preselectedSlotId]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const groupSlotsByDate = () => {
    const grouped = {};
    
    slots.forEach(slot => {
      const date = new Date(slot.startAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    
    return grouped;
  };

  const bookSlot = async (slotId) => {
    setBookingLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      
      await axios.post('/api/book', { slotId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Appointment booked successfully!');
      
      setSlots(slots.filter(slot => slot._id !== slotId));
      
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const groupedSlots = groupSlotsByDate();

  return (
    <div>
      <h1>Book an Appointment</h1>
      <p>Select an available time slot to book your appointment.</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {loading ? (
        <p>Loading available slots...</p>
      ) : slots.length === 0 ? (
        <div>
          <p>No available slots for the next 7 days.</p>
          <button onClick={() => navigate('/')} className="btn">Back to Dashboard</button>
        </div>
      ) : (
        <div>
          {Object.keys(groupedSlots).map(date => (
            <div key={date} className="card" style={{ marginBottom: '20px' }}>
              <h2>{date}</h2>
              <div className="slot-grid">
                {groupedSlots[date].map(slot => (
                  <div 
                    key={slot._id} 
                    id={`slot-${slot._id}`}
                    className="slot-card"
                    style={preselectedSlotId === slot._id ? { border: '2px solid #007bff' } : {}}
                  >
                    <h3>Available Slot</h3>
                    <p><strong>Time:</strong> {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <button 
                      onClick={() => bookSlot(slot._id)} 
                      className="btn"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? 'Booking...' : 'Book This Slot'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;