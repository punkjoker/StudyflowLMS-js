import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Assuming you're using context for user info
import './Grade.css';

const Grades = () => {
  const { userId } = useContext(UserContext);  // Fetching userId from context
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchGrades = async () => {
        try {
          console.log(`Fetching grades for user ID: ${userId}`);
          const response = await axios.get(`http://localhost:5000/api/grades/${userId}`);
          setGrades(response.data);
        } catch (err) {
          console.error('Error fetching grades:', err);
          setError(err.response?.data?.message || 'Failed to load grades.');
        } finally {
          setLoading(false);
        }
      };

      fetchGrades();
    }
  }, [userId]); // This effect will trigger when userId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grades-container">
      <h2>Your Grades</h2>
      {grades.length > 0 ? (
        <div className="grades-table">
          {/* Column headings */}
          <div className="grades-header">
            <div className="grade-title">Assignment</div>
            <div className="grade-title">Total Questions</div>
            <div className="grade-title">Correct Answers</div>
            <div className="grade-title">Grade Percentage</div>
          </div>

          {/* Grade data rows */}
          {grades.map((grade) => (
            <div key={grade.grade_id} className="grades-row">
              <div className="grade-detail">{grade.assignment_title}</div>
              <div className="grade-detail">{grade.total_questions}</div>
              <div className="grade-detail">{grade.correct_answers}</div>
              <div className="grade-detail">{grade.grade_percentage}%</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No grades available.</p>
      )}
    </div>
  );
};

export default Grades;
