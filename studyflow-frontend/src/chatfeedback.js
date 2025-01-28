import React, { useState, useEffect } from 'react';
import './chatfeedback.css';

const ChatFeedback = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);  // Track loading state

  // Add a greeting message when the chat opens
  useEffect(() => {
    const initialMessage = { sender: 'bot', text: 'Hello, how may I assist you?' };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true);  // Start loading when sending a request

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.response };  // Ensure 'response' is returned from the backend
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again later.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setLoading(false);  // Stop loading once the response is received
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2>Chat Box</h2>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {loading && <div className="loading-spinner">...</div>}  {/* Loading spinner */}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}  // Disable input while loading
        />
        <button className="send-button" onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatFeedback;
