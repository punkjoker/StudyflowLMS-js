import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewCourseDetails.css';

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course-details/${courseId}`, { withCredentials: true });
      console.log('Course details:', response.data);
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error.message, error.response ? error.response.data : '');
    }
  };

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details">
      <h2>{courseDetails.title}</h2>
      <p><strong>Description:</strong> {courseDetails.description}</p>
      <h3>Notes:</h3>
      <ul>
        {courseDetails.notes.map(note => (
          <li key={note.id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCourseDetails;
