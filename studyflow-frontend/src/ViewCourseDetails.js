import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewCourseDetails.css';

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const notesContainerRef = useRef(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course-details/${courseId}`, { withCredentials: true });
      console.log('Course details:', response.data);
      setCourseDetails(response.data);
      setActiveNote(response.data.notes[0]);  // Set the first note as active by default
    } catch (error) {
      console.error('Error fetching course details:', error.message, error.response ? error.response.data : '');
    }
  };

  const handleNoteClick = (note) => {
    setActiveNote(note);
  };

  const handleToggleFullScreen = () => {
    if (!isFullScreen) {
      if (notesContainerRef.current.requestFullscreen) {
        notesContainerRef.current.requestFullscreen();
      } else if (notesContainerRef.current.mozRequestFullScreen) { // Firefox
        notesContainerRef.current.mozRequestFullScreen();
      } else if (notesContainerRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
        notesContainerRef.current.webkitRequestFullscreen();
      } else if (notesContainerRef.current.msRequestFullscreen) { // IE/Edge
        notesContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const calculateProgress = () => {
    const totalNotes = courseDetails?.notes.length;
    const viewedNotes = activeNote ? 1 : 0; // Here you can use a more advanced method based on user interaction
    return Math.round((viewedNotes / totalNotes) * 100);
  };

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details">
      <h2>{courseDetails.title}</h2>
      <p><strong>Description:</strong> {courseDetails.description}</p>
      
      <div className="notes-container" ref={notesContainerRef}>
        <div className="notes-sidebar">
          <button onClick={handleToggleFullScreen}>
            {isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          </button>
          <ul>
            {courseDetails.notes.map(note => (
              <li 
                key={note.id} 
                className={activeNote?.id === note.id ? 'active' : ''} 
                onClick={() => handleNoteClick(note)}
              >
                {note.title}
              </li>
            ))}
          </ul>
          <div>
            <strong>Progress: </strong>{calculateProgress()}%
          </div>
        </div>
        
        <div className="notes-content">
          {activeNote && (
            <>
              <h3>{activeNote.title}</h3>
              <p>{activeNote.content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourseDetails;
