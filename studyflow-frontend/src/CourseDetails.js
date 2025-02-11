import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams(); // Extract courseId from the URL parameters
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();

    if (!newNote.title || !newNote.content) {
      setErrorMessage('Both title and content are required.');
      return;
    }

    if (!courseId || isNaN(Number(courseId))) {
      setErrorMessage('Invalid course ID.');
      return;
    }

    console.log('Adding note to Course ID:', courseId);

    try {
      const response = await axios.post(`http://localhost:5000/api/courses/${courseId}/notes`, {
        title: newNote.title,
        content: newNote.content
      });

      if (response.status === 201) {
        setNewNote({ title: '', content: '' });
        setErrorMessage('');
        alert('Note added successfully');
      } else {
        setErrorMessage('Failed to add note. Please try again.');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="course-details">
      <h3>Add Notes</h3>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
        <button type="submit">Add Notes</button>
      </form>
    </div>
  );
};

export default CourseDetails;
