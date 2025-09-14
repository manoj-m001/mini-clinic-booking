import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (err) {
        setError('Failed to fetch available slots');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div>
      <h1>Welcome to the Clinic Appointment System</h1>
      <p>Book your appointment with our healthcare professionals.</p>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Available Slots</h2>
        {loading ? (
          <p>Loading available slots...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : slots.length === 0 ? (
          <p>No available slots for the next 7 days.</p>
        ) : (
          <div className="slot-grid">
            {slots.slice(0, 6).map(slot => (
              <div key={slot._id} className="slot-card">
                <h3>Available Slot</h3>
                <p><strong>Date:</strong> {formatDateTime(slot.startAt)}</p>
                <Link to={`/book?slotId=${slot._id}`} className="btn">Book This Slot</Link>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <Link to="/book" className="btn">View All Available Slots</Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;