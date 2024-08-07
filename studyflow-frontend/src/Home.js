import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Home.css';

// Import the images for the slideshow
import image1 from './images/online1.jpg';
import image2 from './images/online2.jpg';
import image3 from './images/online3.jpg';

const Home = () => {
  return (
    <div className="home">
      <header className="intro-header">
        <h1>Welcome to StudyFlow LMS</h1>
        <p>Your ultimate platform for managing and enhancing your learning experience.</p>
      </header>
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
              <span>Across the world</span>
            </div>
          </div>
        </Slide>
      </div>
    </div>
  );
}

export default Home;
