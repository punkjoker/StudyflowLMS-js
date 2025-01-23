import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext

function Login() {
  const { setUserRole, setUserId } = useContext(UserContext); // Use useContext to get setUserRole and setUserId
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
        setUserId(id); // Save the user ID in context
        localStorage.setItem('student_id', id); // Save user ID to localStorage
        if (role === 'student') {
          navigate('/student');
        } else if (role === 'instructor') {
          navigate('/instructor');
        }
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
        // Handle error (e.g., show error message)
      });
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label><br />
        <input 
          type="text" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        /><br /><br />

        <label htmlFor="password">Password:</label><br />
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        /><br /><br />

        <label htmlFor="role">Role:</label><br />
        <select 
          id="role" 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          required
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select><br /><br />

        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;
