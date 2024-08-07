import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
    axios.post(`http://localhost:5000/api/auth/signup/${endpoint}`, formData)
      .then(response => {
        console.log('User signed up successfully:', response.data);
        window.alert('User signed up successfully!');
      })
      .catch(error => {
        console.error('There was an error signing up!', error);
        window.alert('There was an error signing up. Please try again.');
      });
  };

  return (
    <div className="signup-section">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name:</label><br />
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required /><br /><br />

        <label htmlFor="last_name">Last Name:</label><br />
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required /><br /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

        <label htmlFor="password">Password:</label><br />
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br /><br />

        <label htmlFor="role">Role:</label><br />
        <select id="role" name="role" value={formData.role} onChange={handleChange} required>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select><br /><br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
