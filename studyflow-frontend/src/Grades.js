import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import $ from 'jquery'; // Import jQuery
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import './Grade.css';

const Grades = () => {
  const { userId } = useContext(UserContext);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transcriptRef = useRef(); // Reference for printing & PDF

  useEffect(() => {
    if (userId) {
      const fetchGrades = async () => {
        try {
          console.log(`Fetching grades for user ID: ${userId}`);
          const response = await axios.get(`http://localhost:5000/api/grades/${userId}`);
          console.log("API Response:", response.data);
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
  }, [userId]);

  useEffect(() => {
    console.log("Transcript Ref:", transcriptRef.current);
  }, []);

  // ✅ jQuery Print Function
  const handlePrint = () => {
    if (transcriptRef.current) {
      const content = $(transcriptRef.current).clone(); // Clone transcript
      const newWindow = window.open('', '', 'width=800,height=600');
      newWindow.document.write(`
        <html>
          <head>
            <title>StudyFlow LMS Transcript</title>
            <style>
              @media print {
                .button-container { display: none !important; }
              }
              body { font-family: Arial, sans-serif; }
              .school-name { font-size: 22px; text-align: center; font-weight: bold; }
              .motto { font-style: italic; text-align: center; }
              .grades-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .grades-header, .grades-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
              .grade-title { font-weight: bold; }
            </style>
          </head>
          <body>${content.html()}</body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }
  };

  // ✅ Save as PDF Function using jsPDF
  const handleSaveAsPDF = () => {
    if (transcriptRef.current) {
      html2canvas(transcriptRef.current).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("StudyFlow_Transcript.pdf");
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grades-container">
      <div className="transcript" ref={transcriptRef}>
        <h2 className="school-name">StudyFlow LMS Transcript</h2>
        <p className="motto">"Empowering Learning, Shaping Futures"</p>

        {grades.length > 0 ? (
          <div className="grades-table">
            <div className="grades-header">
              <div className="grade-title">Assignment</div>
              <div className="grade-title">Total Questions</div>
              <div className="grade-title">Correct Answers</div>
              <div className="grade-title">Grade Percentage</div>
            </div>

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

      {/* Print & Save as PDF Buttons */}
      <div className="button-container">
        <button className="print-btn" onClick={handlePrint} disabled={grades.length === 0}>
          Print transcript
        </button>
        <button className="save-btn" onClick={handleSaveAsPDF} disabled={grades.length === 0}>
          Save 
        </button>
      </div>
    </div>
  );
};

export default Grades;
