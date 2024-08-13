import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Assuming you have UserContext to get the current user
import './Courses.css';

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
      setEnrollStatus('Failed to enroll in course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses">
      <h2>Available Courses</h2>
      {loading && <div className="status-message">Loading...</div>}
      {enrollStatus && <div className="status-message">{enrollStatus}</div>}
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button onClick={() => handleEnroll(course.id)}>Enroll</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
