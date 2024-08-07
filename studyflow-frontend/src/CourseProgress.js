import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import './CourseProgress.css';

const CourseProgress = () => {
  const { courseId } = useParams();
  const { userId } = useContext(UserContext); // Assume the UserContext provides the userId
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchCourseNotes();
  }, []);

  const fetchCourseNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/notes`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching course notes:', error);
    }
  };

  return (
    <div className="course-progress">
      <h2>Course Notes</h2>
      <ul>
        {units.map(unit => (
          <li key={unit.unit_id}>
            <div className="unit-details">
              <h3>{unit.unit_title}</h3>
              <p>{unit.notes}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseProgress;
