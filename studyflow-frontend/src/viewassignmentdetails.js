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
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Fetch Assignment Details and Correct Answers
  const fetchAssignmentDetails = useCallback(async () => {
    if (!userId) return; // Ensure user is logged in before fetching

    setLoading(true);
    try {
      console.log(`Fetching assignment details for course ID: ${courseId}`);
      const response = await axios.get(`http://localhost:5000/api/assignment-details/${courseId}`, { withCredentials: true });
      setCourseDetails(response.data);

      // Extract correct answers from API response
      const correctAnswersMap = {};
      response.data.assignments.forEach((assignment) => {
        assignment.questions.forEach((question) => {
          correctAnswersMap[question.id] = question.correct_answer;
        });
      });

      console.log("✅ Correct Answers Map:", correctAnswersMap); // Debugging
      setCorrectAnswers(correctAnswersMap);
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
      alert("User not authenticated. Please log in.");
      return;
    }

    // Validate that all questions have an answer selected
    const assignment = courseDetails.assignments.find(a => a.id === assignmentId);
    if (assignment.questions.some(q => !selectedAnswers[q.id])) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Prepare Answers with Correctness and Grades
    let totalScore = 0;
    const answers = Object.keys(selectedAnswers).map((questionId) => {
      const isCorrect = selectedAnswers[questionId] === correctAnswers[questionId];
      if (isCorrect) totalScore += 1;
      return {
        question_id: parseInt(questionId, 10),
        selected_answer: selectedAnswers[questionId],
        is_correct: isCorrect,
        grade: isCorrect ? 1 : 0, // Assign 1 point per correct answer
      };
    });

    console.log("📩 Sending Submission Data:", { answers, assignmentId, userId });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/submit-answers',
        { answers, assignmentId, userId }, // Send userId
        { withCredentials: true }
      );

      console.log("✅ Submission Response:", response.data);

      setSubmitted(true);
      setScore(totalScore);
      alert(`Assignment submitted successfully! Score: ${totalScore}`);
    } catch (error) {
      console.error("❌ Error submitting answers:", error);
      alert(error.response?.data?.error || "Failed to submit answers.");
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
                              <label
                                key={index}
                                className={submitted && option === correctAnswers[question.id] ? 'correct-answer' : ''}
                              >
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  value={option}
                                  checked={selectedAnswers[question.id] === option}
                                  onChange={() => handleAnswerChange(question.id, option)}
                                  disabled={submitted} // Disable input after submission
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={submitted}>Submit Assignment</button>
                </form>
              )}

              {/* Display Score if Submitted */}
              {submitted && score !== null && (
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
