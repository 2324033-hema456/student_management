
import { Link } from 'react-router-dom';

import Card from '../components/common/Card';

function HomePage() {
  return (
    <div className="home-page">

      {/* WELCOME SECTION */}
      <div className="home-welcome">
        <p className="home-subtitle">
          STUDENT MANAGEMENT SYSTEM
        </p>

        <h1>Welcome to Campus Directory</h1>

        <p>
          Manage student and teacher information easily
          from one place.
        </p>
      </div>

      {/* MANAGEMENT CARDS */}
      <div className="home-cards">

        <Card className="home-card">
          <div className="home-icon">🎓</div>

          <h2>Student Management</h2>

          <p>
            View student details and add new students
            to the directory.
          </p>

          <Link to="/students" className="home-link">
            Manage Students →
          </Link>
        </Card>

        <Card className="home-card">
          <div className="home-icon">👩‍🏫</div>

          <h2>Teacher Management</h2>

          <p>
            View, add, edit and delete teacher records.
          </p>

          <Link to="/teachers" className="home-link">
            Manage Teachers →
          </Link>
        </Card>

      </div>
    </div>
  );
}

export default HomePage;
