import React from 'react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>
      <p>Welcome to your dashboard, Student!</p>
      
      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h3>Available Courses</h3>
          <p>View and enroll in available courses.</p>
          <Link to="/courses" className="dashboard-link">View Courses</Link>
        </section>

        <section className="dashboard-section">
          <h3>Grades</h3>
          <p>Check your grades for completed courses.</p>
          <Link to="/grades" className="dashboard-link">View Grades</Link>
        </section>

        <section className="dashboard-section">
          <h3>Progress</h3>
          <p>Track your progress in enrolled courses.</p>
          <Link to="/progress" className="dashboard-link">View Progress</Link>
        </section>

        <section className="dashboard-section">
          <h3>Assignments</h3>
          <p>View my Assignments.</p>
          <Link to="/Assignments" className="dashboard-link">Go to Assignments</Link>
        </section>

        <section className="dashboard-section">
          <h3>Profile</h3>
          <p>View and edit your profile information.</p>
          <Link to="/profile" className="dashboard-link">View Profile</Link>
        </section>

        {/* New Chat Feedback Section */}
        <section className="dashboard-section">
          <h3>Chat Feedback</h3>
          <p>Interact with the chat assistant for support or feedback.</p>
          <Link to="/chatfeedback" className="dashboard-link">Go to Chat Feedback</Link>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
