import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Progress.css'; // Ensure this file contains the modern CSS styling
import boardImage from './images/board.jpg';


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

      const courseDetails = await Promise.all(
        response.data.map(async (enrollment) => {
          const courseResponse = await axios.get(
            `http://localhost:5000/api/courses/${enrollment.course_id}`,
            { withCredentials: true }
          );
          return { ...enrollment, ...courseResponse.data };
        })
      );

      console.log('Fetched course details:', courseDetails);
      setEnrolledCourses(courseDetails);
    } catch (error) {
      console.error(
        'Error fetching enrolled courses:',
        error.message,
        error.response ? error.response.data : ''
      );
    }
  };

  return (
    <div className="progress">
      <h2>MY LEARNING</h2>
      <h3>In-Progress</h3>
      <div className="course-grid">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
            <img src={boardImage} alt="Course Thumbnail" />
            </div>
            <div className="course-info">
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <Link to={`/viewcoursedetails/${course.course_id}`} className="resume-button">
                Resume Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
