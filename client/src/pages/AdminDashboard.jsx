import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        
        const res = await axios.get('/api/all-bookings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  // Format date and time for display
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>View all bookings across the system.</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings in the system yet.</p>
      ) : (
        <div>
          <h2>All Bookings ({bookings.length})</h2>
          <div className="booking-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <h3>Appointment</h3>
                <p><strong>Patient:</strong> {booking.userId.name} ({booking.userId.email})</p>
                <p><strong>Date & Time:</strong> {formatDateTime(booking.slotId.startAt)}</p>
                <p><strong>Duration:</strong> 30 minutes</p>
                <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;