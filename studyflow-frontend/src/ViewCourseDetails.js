import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewCourseDetails.css';

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('outline'); // Default tab
  const [activeNote, setActiveNote] = useState(null);
  const notesContainerRef = useRef(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course-details/${courseId}`, { withCredentials: true });
      setCourseDetails(response.data);
      if (response.data.notes && response.data.notes.length > 0) {
        setActiveNote(response.data.notes[0]); // Set the first note as active by default
      }
    } catch (error) {
      console.error('Error fetching course details:', error.message, error.response ? error.response.data : '');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details">
      <h2>{courseDetails.title}</h2>
      <p><strong>Description:</strong> {courseDetails.description}</p>
      
      {/* Tabs Navigation */}
      <div className="tabs">
        <button className={activeTab === 'outline' ? 'active' : ''} onClick={() => handleTabChange('outline')}>
          Outline
        </button>
        <button className={activeTab === 'resources' ? 'active' : ''} onClick={() => handleTabChange('resources')}>
          Resources
        </button>
        <button className={activeTab === 'badges' ? 'active' : ''} onClick={() => handleTabChange('badges')}>
          Badges
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
      {activeTab === 'outline' && (
  <div className="outline">
    <h3>Course Outline</h3>
    <ul>
      {courseDetails.notes && courseDetails.notes.length > 0 ? (
        courseDetails.notes.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))
      ) : (
        <p>No outline available.</p>
      )}
    </ul>
  </div>
)}

        {activeTab === 'resources' && (
          <div className="resources">
            <h3>Resources</h3>
            <div className="notes-container" ref={notesContainerRef}>
              <div className="notes-sidebar">
                <ul>
                  {courseDetails.notes && courseDetails.notes.length > 0 ? (
                    courseDetails.notes.map((note) => (
                      <li
                        key={note.id}
                        className={activeNote?.id === note.id ? 'active' : ''}
                        onClick={() => setActiveNote(note)}
                      >
                        {note.title}
                      </li>
                    ))
                  ) : (
                    <p>No notes available.</p>
                  )}
                </ul>
              </div>
              <div className="notes-content">
                {activeNote ? (
                  <>
                    <h4>{activeNote.title}</h4>
                    <p>{activeNote.content}</p>
                  </>
                ) : (
                  <p>Select a note to view its content.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="badges">
            <h3>Achievements</h3>
            <div className="badge-list">
              {courseDetails.badges && courseDetails.badges.length > 0 ? (
                courseDetails.badges.map((badge, index) => (
                  <div key={index} className="badge">
                    <img src={badge.image} alt={badge.name} />
                    <p>{badge.name}</p>
                  </div>
                ))
              ) : (
                <p>No badges earned yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourseDetails;
