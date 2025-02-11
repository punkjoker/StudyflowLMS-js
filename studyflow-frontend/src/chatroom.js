import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatroom.css'; // Ensure this matches the actual filename

const CertificateUpload = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [remarks, setRemarks] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  // Upload certificate and reset form fields
  const handleUpload = async () => {
    if (!selectedStudent || !remarks.trim() || !certificateFile) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('student_id', selectedStudent);
    formData.append('remarks', remarks);
    formData.append('certificate', certificateFile);

    try {
      await axios.post('http://localhost:5000/api/certificates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Certificate uploaded successfully!');
      // Reset fields
      setSelectedStudent('');
      setRemarks('');
      setCertificateFile(null);
    } catch (error) {
      console.error('Error uploading certificate:', error);
    }
  };

  return (
    <div className="certificate-upload">
      <div className="upload-form">
        <label htmlFor="student">Select Student:</label>
        <select
          id="student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name} {student.last_name}
            </option>
          ))}
        </select>

        <label htmlFor="remarks">Remarks:</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks..."
        />

        <label htmlFor="certificate">Upload Certificate:</label>
        <input
          type="file"
          id="certificate"
          accept=".pdf,.jpg,.png,.docx"
          onChange={handleFileChange}
        />

        <button onClick={handleUpload}>Upload Certificate</button>
      </div>
    </div>
  );
};

export default CertificateUpload;
