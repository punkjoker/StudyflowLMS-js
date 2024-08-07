import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    // Assuming user ID is stored in localStorage after login
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/api/auth/user?id=${userId}`, { withCredentials: true })
        .then(response => {
          const user = response.data;
          setFormData({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          });
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:5000/api/auth/user', formData, { withCredentials: true })
      .then(response => {
        alert('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div>
      <h2>Welcome, {formData.first_name}!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name:</label><br />
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required /><br /><br />

        <label htmlFor="last_name">Last Name:</label><br />
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required /><br /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
