import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Home.css';
import jobImage from './images/job.jpg';

// Import the images for the slideshow
import image1 from './images/online1.jpg';
import image2 from './images/online2.jpg';
import image3 from './images/online3.jpg';

// Import icons (e.g., Material UI icons or any icon library you're using)
import { FaNetworkWired, FaCloud, FaShieldAlt, FaDatabase, FaCode, FaCogs, FaRobot, FaLaptopCode, FaMobileAlt, FaChalkboardTeacher } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home">
      <header className="intro-header">
        <h1>Welcome to StudyFlow LMS</h1>
        <p>Your ultimate platform for managing and enhancing your learning experience.</p>
      </header>

      {/* Slideshow Section */}
      <div className="slideshow-container">
        <Slide easing="ease">
          <div className="each-slide">
            <div style={{ backgroundImage: `url(${image1})` }}>
              <span>Study</span>
            </div>
          </div>
          <div className="each-slide">
            <div style={{ backgroundImage: `url(${image2})` }}>
              <span>Anywhere</span>
            </div>
          </div>
          <div className="each-slide">
            <div style={{ backgroundImage: `url(${image3})` }}>
              <span>Across the World</span>
            </div>
          </div>
        </Slide>
      </div>

      {/* Subject Areas Section */}
      <section className="subject-areas">
        <h2>Explore Subject Areas</h2>
        <div className="subject-icons">
          <div className="subject-item">
            <FaNetworkWired className="icon" />
            <p>Networking</p>
          </div>
          <div className="subject-item">
            <FaCloud className="icon" />
            <p>Cloud Computing</p>
          </div>
          <div className="subject-item">
            <FaShieldAlt className="icon" />
            <p>Cybersecurity</p>
          </div>
          <div className="subject-item">
            <FaDatabase className="icon" />
            <p>Data Science</p>
          </div>
          <div className="subject-item">
            <FaCode className="icon" />
            <p>Programming</p>
          </div>
          <div className="subject-item">
            <FaCogs className="icon" />
            <p>DevOps</p>
          </div>
          <div className="subject-item">
            <FaRobot className="icon" />
            <p>AI & Robotics</p>
          </div>
          <div className="subject-item">
            <FaLaptopCode className="icon" />
            <p>Web Development</p>
          </div>
          <div className="subject-item">
            <FaMobileAlt className="icon" />
            <p>Mobile Development</p>
          </div>
          <div className="subject-item">
            <FaChalkboardTeacher className="icon" />
            <p>Education</p>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <h2>Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">Networking Basics</div>
          <div className="course-card">Cybersecurity Fundamentals</div>
          <div className="course-card">Cloud Essentials</div>
          <div className="course-card">Data Analytics</div>
          <div className="course-card">Full Stack Web Development</div>
          <div className="course-card">AI for Beginners</div>
          <div className="course-card">DevOps Practices</div>
          <div className="course-card">Mobile App Development</div>
          <div className="course-card">Programming in Python</div>
          <div className="course-card">Advanced Machine Learning</div>
        </div>
      </section>

      {/* Prepare for Your Next Job Section */}
      <section className="next-job">
        <h2>Prepare for Your Next Job</h2>
        <div className="next-job-content">
          <div className="text-content">
            <p>Looking for your next big opportunity? Learn the skills that matter, get certified, and land your dream job with StudyFlow LMS.</p>
            <button>Explore Career Paths</button>
          </div>
          <div className="image-content">
            {/* Add a relevant image here */}
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
