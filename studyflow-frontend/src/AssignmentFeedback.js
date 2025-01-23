import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './AssignmentFeedback.css';

const AssignmentFeedback = () => {
  const { user } = useContext(UserContext);
  const [submissions, setSubmissions] = useState([]);
  const [feedback, setFeedback] = useState({ assignmentId: '', comments: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchSubmissions();
    }
  }, [user]);

  // Fetch submissions for the instructor
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructor/submissions?instructor_id=${user.id}`, { withCredentials: true });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
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

  const handleViewSubmissionDetails = (submissionId) => {
    // Handle the action to view detailed submission, e.g., redirect or show a modal with details
    console.log('View details for submission ID:', submissionId);
  };

  return (
    <div className="assignment-feedback">
      <h3>Assignment Feedback</h3>
      
      {/* List of submissions */}
      <div className="submissions-list">
        <h4>Submissions</h4>
        {submissions.length === 0 ? (
          <p>No submissions available.</p>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="submission-item">
              <p><strong>Student:</strong> {submission.student_name}</p>
              <p><strong>Assignment:</strong> {submission.assignment_title}</p>
              <p><strong>Submission Date:</strong> {new Date(submission.submission_date).toLocaleString()}</p>
              <button onClick={() => handleViewSubmissionDetails(submission.id)}>
                View Submission Details
              </button>
            </div>
          ))
        )}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AssignmentFeedback;
