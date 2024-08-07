import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './AssignmentFeedback.css';

const AssignmentFeedback = () => {
  const { user } = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);
  const [feedback, setFeedback] = useState({ assignmentId: '', comments: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructor/assignments?instructor_id=${user.id}`, { withCredentials: true });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setMessage('User not logged in or user ID not available');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/instructor/feedback', feedback, { withCredentials: true });
      setFeedback({ assignmentId: '', comments: '' });
      setMessage('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
      setMessage(`Error submitting feedback: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="assignment-feedback">
      <h3>Assignment Feedback</h3>
      <form onSubmit={handleFeedbackSubmit}>
        <label htmlFor="assignmentId">Assignment:</label>
        <select id="assignmentId" name="assignmentId" value={feedback.assignmentId} onChange={handleFeedbackChange} required>
          <option value="">Select Assignment</option>
          {assignments.map(assignment => (
            <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
          ))}
        </select>
        <label htmlFor="comments">Comments:</label>
        <textarea id="comments" name="comments" value={feedback.comments} onChange={handleFeedbackChange} required />
        <button type="submit">Submit Feedback</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AssignmentFeedback;
