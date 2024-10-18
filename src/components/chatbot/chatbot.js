import React, { useEffect, useState } from 'react';
import Header from '../base_components/header';
import axios from 'axios'; // Import axios
import './chatbot.css';

const Chat = () => {
  // State to store messages
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Function to send a message
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { sender: 'user', text: input };
      setMessages([...messages, newMessage]);
      setInput(''); // Clear input field

      // Send the user message to the backend
      try {
        const response = await axios.post('http://localhost:5000/chat', {
          message: input,
        });

        // Add bot response to the messages
        const botResponse = { sender: 'bot', text: response.data.response,dec:response.data.description };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            msg.sender=='user'?(
            <div
              key={index}
              id="messages"
              className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <h2>{msg.text}</h2>
            </div>):(
              <div id='llm_response'>
            <img src={`movies/${msg.text}`} className='rec_pic'></img>  
            <div id="llm_dec"><h2>${msg.dec}</h2></div>
            </div>
            )
            
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="chat-send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
