import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './AssignmentFeedback.css';

const AssignmentFeedback = () => {
  const { userId } = useContext(UserContext);
  const [submissions, setSubmissions] = useState([]);
  const feedbackRef = useRef(); // Reference for printing

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log(`Fetching submissions for user ID: ${userId}`);
        const response = await axios.get(`http://localhost:5000/api/submissions?userId=${userId}`, {
          withCredentials: true,
        });

        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error.message);
      }
    };

    fetchSubmissions();
  }, [userId]);

  // ✅ Print / Save as PDF
  const handlePrint = () => {
    if (feedbackRef.current) {
      const newWindow = window.open('', '', 'width=800,height=600');
      newWindow.document.write(`
        <html>
          <head>
            <title>Assignment Feedback Report</title>
            <style>
              @media print {
                .button-container { display: none !important; }
              }
              body { font-family: Arial, sans-serif; }
              .header { text-align: center; font-size: 22px; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <h2 class="header">Assignment Feedback Report</h2>
            ${feedbackRef.current.innerHTML}
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }
  };

  return (
    <div className="assignment-feedback">
      <h3>Student Submissions</h3>

      <div ref={feedbackRef} className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Assignment Title</th>
              <th>Marks</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No submissions available.</td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{submission.first_name} {submission.last_name}</td>
                  <td>{submission.assignment_title}</td>
                  <td>{submission.correct_answers} / {submission.total_questions}</td>
                  <td>{submission.grade_percentage}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Print & Save Button */}
      <div className="button-container">
        <button 
          className="print-btn" 
          onClick={handlePrint} 
          disabled={submissions.length === 0} // Disable if no submissions
        >
          Print transcript
        </button>
      </div>
    </div>
  );
};

export default AssignmentFeedback;
