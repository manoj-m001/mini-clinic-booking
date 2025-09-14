import { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        
        const res = await axios.get('/api/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch your bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div>
      <h1>My Bookings</h1>
      <p>View all your scheduled appointments.</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You don't have any bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-item">
              <h3>Appointment</h3>
              <p><strong>Date & Time:</strong> {formatDateTime(booking.slotId.startAt)}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;