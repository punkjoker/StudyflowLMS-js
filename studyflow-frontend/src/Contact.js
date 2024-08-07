import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
    // Implement form submission logic here, e.g., send data to backend server.
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label><br />
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

        <label htmlFor="message">Message:</label><br />
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required /><br /><br />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
