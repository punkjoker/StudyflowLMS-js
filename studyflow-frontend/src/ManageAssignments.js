import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAssignments.css';

const ManageAssignments = ({ instructorId }) => {
  const [courses, setCourses] = useState([]); // State to hold the list of courses
  const [courseId, setCourseId] = useState(''); // Hold the selected course ID
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch courses when the component loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses?instructorId=${instructorId}`);
        setCourses(response.data); // Assuming the API filters by instructorId and returns relevant courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [instructorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new assignment object
    const newAssignment = { course_id: courseId, title, description, due_date: dueDate };

    try {
      const response = await axios.post('http://localhost:5000/api/assignments', newAssignment);
      alert(response.data.message);

      // Reset the form
      setCourseId('');
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
          <label>Course Name</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} {/* Use 'title' to display course names */}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Assignment</button>
      </form>
    </div>
  );
};

export default ManageAssignments;
