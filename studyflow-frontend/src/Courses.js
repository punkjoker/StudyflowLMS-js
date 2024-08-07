import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollStatus, setEnrollStatus] = useState('');
  const [studentId, setStudentId] = useState(1); // Replace this with the actual student ID, e.g., from the logged-in user state

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/enroll',
        { studentId, courseId },
        { withCredentials: true }
      );
      setEnrollStatus('Successfully enrolled!');
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setEnrollStatus('Failed to enroll in course.');
    }
  };

  return (
    <div className="courses">
      <h2>Available Courses</h2>
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
