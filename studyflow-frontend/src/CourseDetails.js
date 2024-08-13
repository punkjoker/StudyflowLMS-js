import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams(); // Extract courseId from URL parameters
  const [course, setCourse] = useState({});
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  }, [courseId]);

  const fetchNotes = useCallback(async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchNotes();
    }
  }, [courseId, fetchCourseDetails, fetchNotes]);

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prevNote => ({ ...prevNote, [name]: value }));
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return;
    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/notes`, { ...newNote });
      fetchNotes();
      setNewNote({ title: '', content: '' }); // Clear the form
      alert('Notes added successfully'); // Popup alert for success
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="course-details">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <div className="course-section">
        <h3>Notes</h3>
        <form onSubmit={handleNoteSubmit}>
          <input
            type="text"
            name="title"
            value={newNote.title}
            onChange={handleNoteChange}
            placeholder="Note Title"
            required
          />
          <textarea
            name="content"
            value={newNote.content}
            onChange={handleNoteChange}
            placeholder="Add new notes"
            required
          />
          <button type="submit">Add NoteS</button>
        </form>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetails;
