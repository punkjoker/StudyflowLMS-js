import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Assuming you have UserContext to get the current user
import './Courses.css';

// Import a default image
import defaultImage from './images/list.jpg'; // Adjust the path to match your project structure

const Courses = () => {
  const { userId } = useContext(UserContext); // Get userId from context
  const [courses, setCourses] = useState([]);
  const [enrollStatus, setEnrollStatus] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setEnrollStatus('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/enroll',
        { studentId: userId, courseId }, // Use dynamic userId
        { withCredentials: true }
      );
      setEnrollStatus('Successfully enrolled!');
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setEnrollStatus('Already enrolled in course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses">
      <h2>Available Courses</h2>
      {loading && <div className="status-message">Loading...</div>}
      {enrollStatus && <div className="status-message">{enrollStatus}</div>}
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-label">Beginner</div>
            <img
              src={defaultImage} // Use imported default image
              alt={course.title}
              className="course-image"
            />
            <div className="course-details">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span className="course-time">{course.duration || '40 Hours'}</span>
                <span className="course-free">Free</span>
              </div>
              <button onClick={() => handleEnroll(course.id)}>Click To Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
