import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext
import './Login.css'; // Import a separate CSS file for styling
import learnImage from './images/learn.png'; // Import your image

function Login() {
  const { setUserRole, setUserId } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    axios.post('http://localhost:5000/api/auth/login', formData)
      .then(response => {
        const { id, role } = response.data;
        setUserRole(role);
        setUserId(id);
        localStorage.setItem('student_id', id);
        if (role === 'student') {
          navigate('/student');
        } else if (role === 'instructor') {
          navigate('/instructor');
        }
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={learnImage} alt="Learn" className="login-image" />
        <h2>Build Your Skills With StudyFlow</h2>
        <p>Pursue real career paths through instructor-led courses taught by experts and free, online courses backed by StudyFlow's expertise.</p>
      </div>
      <div className="login-right">
        <div className="login-header">
          
        </div>
        <h2>Welcome!</h2>
        <p>Please login to your account.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="additional-links">
          <Link to="/forgot-password">Forgot Password?</Link><br />
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
