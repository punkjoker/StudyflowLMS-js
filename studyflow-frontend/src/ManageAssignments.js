import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './ManageAssignments.css';

const ManageAssignments = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ courseId: '', title: '', description: '', dueDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructor/courses?instructor_id=${user.id}`, { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setMessage('User not logged in or user ID not available');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/instructor/assignments', newAssignment, { withCredentials: true });
      setNewAssignment({ courseId: '', title: '', description: '', dueDate: '' });
      setMessage('Assignment added successfully');
    } catch (error) {
      console.error('Error adding assignment:', error.response ? error.response.data : error.message);
      setMessage(`Error adding assignment: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="manage-assignments">
      <h3>Manage Assignments</h3>
      <form onSubmit={handleAssignmentSubmit}>
        <label htmlFor="courseId">Course:</label>
        <select id="courseId" name="courseId" value={newAssignment.courseId} onChange={handleAssignmentChange} required>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
        <label htmlFor="title">Assignment Title:</label>
        <input type="text" id="title" name="title" value={newAssignment.title} onChange={handleAssignmentChange} required />
        <label htmlFor="description">Assignment Description:</label>
        <input type="text" id="description" name="description" value={newAssignment.description} onChange={handleAssignmentChange} required />
        <label htmlFor="dueDate">Due Date:</label>
        <input type="date" id="dueDate" name="dueDate" value={newAssignment.dueDate} onChange={handleAssignmentChange} required />
        <button type="submit">Add Assignment</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ManageAssignments;
