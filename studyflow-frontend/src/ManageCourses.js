import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { UserContext } from './UserContext';
import './ManageCourses.css';

const ManageCourses = () => {
  const { userId } = useContext(UserContext); // Retrieve userId from UserContext
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

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

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', { ...newCourse, instructor_id: userId }, { withCredentials: true });
      fetchCourses(); // Refresh the course list
      setNewCourse({ title: '', description: '' }); // Clear form inputs
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="manage-courses">
      <h2>Manage Courses</h2>
      <form onSubmit={handleCourseSubmit}>
        <label htmlFor="title">Course Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newCourse.title}
          onChange={handleCourseChange}
          required
        />
        <label htmlFor="description">Course Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={newCourse.description}
          onChange={handleCourseChange}
          required
        />
        <button type="submit">Add Course</button>
      </form>

      <h3>Course List</h3>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>
              {course.title} - {course.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCourses;
