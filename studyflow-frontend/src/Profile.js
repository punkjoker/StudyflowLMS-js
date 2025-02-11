import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [studentCertificates, setStudentCertificates] = useState([]); // Store certificates
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCertificates = async () => {
      // Assuming user ID is stored in localStorage after login
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/certificates?student_id=${userId}`);
          setStudentCertificates(response.data); // Assuming response contains a list of certificates
        } catch (error) {
          console.error('Error fetching certificates:', error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div>
      <h2>Your Certificates</h2>

      {loading ? (
        <p>Loading certificates...</p>
      ) : (
        <div>
          {studentCertificates.length === 0 ? (
            <p>No certificates found.</p>
          ) : (
            <ul>
              {studentCertificates.map((certificate) => (
                <li key={certificate.id}>
                  <h3>{certificate.name}</h3>
                  <p>{certificate.remarks}</p>
                  <a href={`http://localhost:5000/uploads/${certificate.file}`} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
