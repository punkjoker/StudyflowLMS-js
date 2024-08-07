import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Progress.css';

const Progress = () => {
  const { userId } = useContext(UserContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchEnrolledCourses();
    }
  }, [userId]);

  const fetchEnrolledCourses = async () => {
    try {
      console.log(`Fetching enrolled courses for user ID: ${userId}`);
      const response = await axios.get(`http://localhost:5000/api/enrollments/${userId}`, { withCredentials: true });
      console.log('Fetched enrolled courses:', response.data); // Log the fetched data
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error.message, error.response ? error.response.data : '');
    }
  };

  return (
    <div className="progress">
      <h2>Enrolled Courses</h2>
      <ul>
        {enrolledCourses.map(course => (
          <li key={course.id}>
            <div className="course-details">
              <span><strong>{course.title}</strong></span>
              <p>{course.description}</p>
              <Link to={`/progress/${course.course_id}`} className="view-details-button">View Details</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Progress;
