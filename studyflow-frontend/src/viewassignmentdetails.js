import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext
import './ViewAssignmentDetails.css';

const ViewAssignmentDetails = () => {
  const { courseId } = useParams();
  const { userId } = useContext(UserContext); // Get logged-in userId
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [score, setScore] = useState(null);

  // Fetch Assignment Details
  const fetchAssignmentDetails = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      console.log(`Fetching assignment details for course ID: ${courseId}`);
      const response = await axios.get(
        `http://localhost:5000/api/assignment-details/${courseId}?userId=${userId}`,
        { withCredentials: true }
      );

      setCourseDetails(response.data);

      const correctAnswersMap = {};
      const submittedMap = {};

      response.data.assignments.forEach((assignment) => {
        assignment.questions.forEach((question) => {
          correctAnswersMap[question.id] = question.correct_answer;
        });

        submittedMap[assignment.id] = assignment.submitted;
      });

      setCorrectAnswers(correctAnswersMap);
      setSubmittedAssignments(submittedMap);
    } catch (error) {
      console.error('❌ Error fetching assignment details:', error);
      alert(error.response?.data?.message || 'Failed to load assignment details.');
    } finally {
      setLoading(false);
    }
  }, [courseId, userId]);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails]);

  // Track Answer Selection
  const handleAnswerChange = (questionId, selectedAnswer) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: selectedAnswer,
    }));
  };

  // Handle Assignment Submission
  const handleSubmit = async (assignmentId, e) => {
    e.preventDefault();
    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const assignment = courseDetails.assignments.find((a) => a.id === assignmentId);
    if (assignment.questions.some((q) => !selectedAnswers[q.id])) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let totalScore = 0;
    const answers = Object.keys(selectedAnswers).map((questionId) => {
      const isCorrect = selectedAnswers[questionId] === correctAnswers[questionId];
      if (isCorrect) totalScore += 1;
      return {
        question_id: parseInt(questionId, 10),
        selected_answer: selectedAnswers[questionId], // Store answer as A, B, C, D
        is_correct: isCorrect,
      };
    });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/submit-answers',
        { answers, assignmentId, userId },
        { withCredentials: true }
      );

      console.log('✅ Submission Response:', response.data);

      setSubmittedAssignments((prev) => ({ ...prev, [assignmentId]: true }));
      setScore(totalScore);

      alert(`Assignment submitted successfully! Score: ${totalScore}`);
    } catch (error) {
      console.error('❌ Error submitting answers:', error);
      alert(error.response?.data?.error || 'Failed to submit answers.');
    }
  };

  if (loading) return <div className="spinner">Loading assignment details...</div>;
  if (!courseDetails) return <p>No details available for this course.</p>;

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
              {!submittedAssignments[assignment.id] ? (
                <form onSubmit={(e) => handleSubmit(assignment.id, e)}>
                  <div className="questions-section">
                    <h4>Questions:</h4>
                    {assignment.questions.map((question, qIndex) => {
                      const optionLabels = ['A', 'B', 'C', 'D']; // Assign labels dynamically
                      const optionsWithLabels = question.options.map((opt, idx) => ({
                        label: optionLabels[idx],
                        text: opt,
                      }));

                      return (
                        <div key={question.id} className="question-item">
                          <p>{question.text}</p>
                          {optionsWithLabels.length > 0 && (
                            <div className="options">
                              {optionsWithLabels.map((option) => (
                                <label key={option.label}>
                                  <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option.label} // Store answer as A, B, C, D
                                    checked={selectedAnswers[question.id] === option.label}
                                    onChange={() => handleAnswerChange(question.id, option.label)}
                                  />
                                  {option.label}. {option.text} {/* Show A. Option */}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button type="submit">Submit Assignment</button>
                </form>
              ) : (
                <p className="submitted-message">✅ Assignment Submitted</p>
              )}

              {/* Display Score if Submitted */}
              {submittedAssignments[assignment.id] && score !== null && (
                <p className="score-display">Your Score: {score} / {assignment.questions.length}</p>
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
