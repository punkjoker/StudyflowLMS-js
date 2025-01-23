import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Import UserContext
import './chatroom.css'; // Ensure this matches the actual filename

const ChatRoom = ({ chatId }) => {
  const { userRole, userId } = useContext(UserContext); // Get user role and ID from context
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const payload = {
        sender_id: userId,
        sender_type: userRole,
        receiver_id: chatId, // Assuming chatId corresponds to the receiver's ID
        message,
      };
      await axios.post('http://localhost:5000/api/chats', payload);
      setMessage('');
      const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender_type === userRole && msg.sender_id === userId ? 'self' : ''
            }`}
          >
            <div className="message-sender">
              {msg.sender_name} ({msg.sender_type})
            </div>
            <div className="message-content">{msg.message}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
