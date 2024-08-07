import React from 'react';
import { Link } from 'react-router-dom';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  return (
    <div className="instructor-dashboard">
      <h2>Instructor Dashboard</h2>
      <p>Welcome to your dashboard, Instructor!</p>

      <div className="dashboard-container">
        <section className="dashboard-section left">
          <h3>Manage Courses</h3>
          <Link to="/manage-courses" className="dashboard-link">Go to Manage Courses</Link>
        </section>

        <section className="dashboard-section right">
          <h3>Manage Assignments</h3>
          <Link to="/manage-assignments" className="dashboard-link">Go to Manage Assignments</Link>
        </section>

        <section className="dashboard-section left">
          <h3>Assignment Feedback</h3>
          <Link to="/assignment-feedback" className="dashboard-link">Give Assignment Feedback</Link>
        </section>

        <section className="dashboard-section right">
          <h3>Chatroom</h3>
          <Link to="/chatroom" className="dashboard-link">Go to Chatroom</Link>
        </section>
      </div>
    </div>
  );
};

export default InstructorDashboard;
