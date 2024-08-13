import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAssignments.css';

const ManageAssignments = ({ instructorId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [instructorId]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructor/courses?instructor_id=${instructorId}`);
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourseId(response.data[0].id); // Set the first course as the default selected course
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAssignment = { title, description, due_date: dueDate, course_id: selectedCourseId };

    try {
      const response = await axios.post('http://localhost:5000/api/assignments', newAssignment);
      alert(response.data.message);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Failed to add assignment');
    }
  };

  return (
    <div className="manage-assignments">
      <h2>Manage Assignments</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            required
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>
        <button type="submit">Add Assignment</button>
      </form>
    </div>
  );
};

export default ManageAssignments;
