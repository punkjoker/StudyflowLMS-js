import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Reuse the Login.css for consistent styling
import learnImage from './images/learn.png'; // Use the same image from the login page

function Signup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = formData.role === 'student' ? 'student' : 'instructor';
    axios
      .post(`http://localhost:5000/api/auth/signup/${endpoint}`, formData)
      .then((response) => {
        console.log('User signed up successfully:', response.data);
        window.alert('User signed up successfully!');
      })
      .catch((error) => {
        console.error('There was an error signing up!', error);
        window.alert('There was an error signing up. Please try again.');
      });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={learnImage} alt="Learn" className="login-image" />
        <h2>Build Your Skills With StudyFlow lms</h2>
        <p>
          Pursue real career paths through instructor-led courses taught by
          experts and free, online courses backed by StudyFlow's expertise.
        </p>
      </div>
      <div className="login-right">
      
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />

          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>
        <p className="additional-links">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
