import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import './ViewAssignmentDetails.css';

const ViewAssignmentDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [submissionData, setSubmissionData] = useState({ textResponse: '', file: null });
  const [loading, setLoading] = useState(false);
  const { userId } = useContext(UserContext);

  const fetchAssignmentDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/assignment-details/${courseId}`, { withCredentials: true });
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      alert(error.response?.data?.message || 'Failed to load assignment details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB.');
      return;
    }
    if (file && !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
      alert('Only PDF, PNG, or JPEG files are allowed.');
      return;
    }
    setSubmissionData({ ...submissionData, file });
  };

  const handleTextChange = (e) => {
    setSubmissionData({ ...submissionData, textResponse: e.target.value });
  };

  const handleSubmit = async (assignmentId) => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    if (!submissionData.textResponse && !submissionData.file) {
      alert('Please enter a response or upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('student_id', userId);
    formData.append('text_response', submissionData.textResponse);
    if (submissionData.file) {
      formData.append('file', submissionData.file);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/submit-assignment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      setSubmissionData({ textResponse: '', file: null });
      fetchAssignmentDetails();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert(error.response?.data?.message || 'Failed to submit assignment.');
    }
  };

  if (loading) {
    return <div className="spinner">Loading assignment details...</div>;
  }

  if (!courseDetails) {
    return <p>No details available for this course. Please check back later.</p>;
  }

  return (
    <div className="assignment-details-container">
      <h2>{courseDetails.courseTitle}</h2>
      <p><strong>Description:</strong> {courseDetails.courseDescription}</p>
      <h3>Assignments:</h3>
      {courseDetails.assignments.length > 0 ? (
        <ul>
          {courseDetails.assignments.map((assignment) => (
            <li key={assignment.id} className="assignment-item">
              <h4>{assignment.title}</h4>
              <p>{assignment.description}</p>
              <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
              <div className="submission-area">
                <textarea
                  aria-label="Enter your response"
                  placeholder="Enter your response here"
                  onChange={handleTextChange}
                  value={submissionData.textResponse}
                ></textarea>
                <input type="file" aria-label="Upload your file" onChange={handleFileChange} />
                <button onClick={() => handleSubmit(assignment.id)}>Submit Assignment</button>
                {submissionData.file && (
                  <button type="button" onClick={() => setSubmissionData({ ...submissionData, file: null })}>
                    Clear File
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments available for this course.</p>
      )}
    </div>
  );
};

export default ViewAssignmentDetails;
