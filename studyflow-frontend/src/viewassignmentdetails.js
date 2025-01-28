import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAssignmentDetails.css';

const ViewAssignmentDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});  // Track selected answers

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

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: selectedAnswer,
    }));
  };

  const handleSubmit = async (assignmentId, e) => {
    e.preventDefault();

    // Create an array of answers to submit
    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      question_id: questionId,
      selected_answer: selectedAnswers[questionId],
    }));

    try {
      await axios.post('http://localhost:5000/api/submit-answers', { answers, assignmentId }, { withCredentials: true });
      alert(`Answers for Assignment ${assignmentId} submitted successfully!`);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert(error.response?.data?.message || 'Failed to submit answers.');
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
      {courseDetails.assignments?.length > 0 ? (
        <ul>
          {courseDetails.assignments.map((assignment) => (
            <li key={assignment.id} className="assignment-item">
              <h4>{assignment.title}</h4>
              <p>{assignment.description}</p>
              <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>

              {/* Questions Section */}
              {assignment.questions.length > 0 && (
                <form onSubmit={(e) => handleSubmit(assignment.id, e)}>
                  <div className="questions-section">
                    <h4>Questions:</h4>
                    {assignment.questions.map((question) => (
                      <div key={question.id} className="question-item">
                        <p>{question.text}</p>
                        {question.options && question.options.length > 0 && (
                          <div className="options">
                            {question.options.map((option, index) => (
                              <label key={index}>
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  value={option}
                                  checked={selectedAnswers[question.id] === option}
                                  onChange={() => handleAnswerChange(question.id, option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit">Submit Answers for Assignment {assignment.id}</button>
                </form>
              )}
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
