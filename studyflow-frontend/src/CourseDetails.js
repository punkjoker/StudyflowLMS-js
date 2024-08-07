import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newResource, setNewResource] = useState(null); // For file uploads
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchCourseDetails();
    fetchResources();
    fetchNotes();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleResourceChange = (e) => {
    setNewResource(e.target.files[0]);
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resource', newResource);

    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchResources();
      setNewResource(null);
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/notes`, { note: newNote });
      fetchNotes();
      setNewNote('');
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  return (
    <div className="course-details">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <div className="course-sections">
        <div className="course-section">
          <h3>Resources</h3>
          <form onSubmit={handleResourceSubmit}>
            <input
              type="file"
              onChange={handleResourceChange}
              required
            />
            <button type="submit">Upload Resource</button>
          </form>
          <ul>
            {resources.map((resource, index) => (
              <li key={index}>
                <a href={`http://localhost:5000/${resource.path}`} download>{resource.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="course-section">
          <h3>Notes</h3>
          <form onSubmit={handleNoteSubmit}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add new notes"
              required
            />
            <button type="submit">Add Notee</button>
          </form>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="course-section">
          <h3>Chatroom</h3>
          <p>Chatroom functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
