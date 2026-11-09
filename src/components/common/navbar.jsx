
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">C</span>
          <span>Campus Directory</span>
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar-links">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Teachers
          </NavLink>

        </div>

        {/* Profile Icon */}
        <div className="navbar-profile">
          <span className="profile-icon">H</span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
