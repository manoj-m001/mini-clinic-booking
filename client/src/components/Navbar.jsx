import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Clinic App</Link>
      <ul className="navbar-nav">
        {user ? (
          // Logged in navigation
          <>
            {user.role === 'patient' ? (
              // Patient navigation
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/book" className="nav-link">Book Appointment</Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                </li>
              </>
            ) : (
              // Admin navigation
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Admin Dashboard</Link>
              </li>
            )}
            <li className="nav-item">
              <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          // Not logged in navigation
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;