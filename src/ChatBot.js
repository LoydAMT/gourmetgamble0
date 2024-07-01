import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const CHATGPT_API_KEY = 'sk-proj-AvE3vAq0ijffp4otfxV4T3BlbkFJdHxfYn9nspawQXue7uls';  // Ensure this key is still valid

  // Initialize the chat with a welcome message
  useEffect(() => {
    const welcomeMessage = {
      _id: new Date().getTime(),
      text: "Welcome to Food Bot! 🎉 Ask me for recipes like 'What is the recipe for lasagna?' or 'How do I make a smoothie?'",
      createdAt: new Date(),
      user: { _id: 2, name: 'Food Bot' }
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async (text) => {
    const userMessage = {
      _id: new Date().getTime(),
      text: text,
      createdAt: new Date(),
      user: { _id: 1 }
    };
    setMessages(messages => [...messages, userMessage]);  

    const messageText = text.toLowerCase();
    const keywords = ['recipe', 'food', 'breakfast', 'lunch', 'dinner', 'fruit', 'healthy'];

    if (!keywords.some(keyword => messageText.includes(keyword))) {
      const botMessage = {
        _id: new Date().getTime() + 1,
        text: "I'm still learning, please ask me about food and recipes only, like 'How do I bake a cake?'",
        createdAt: new Date(),
        user: { _id: 2, name: 'Food Bot' }
      };
      setMessages(messages => [...messages, botMessage]);
      return;
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: "gpt-3.5-turbo-instruct", 
        prompt: `get me a recipe for ${messageText}`,
        max_tokens: 1200,
        temperature: 0.2,
        n: 1,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGPT_API_KEY}`
        }
      });

      const recipe = response.data.choices[0].text.trim();
      const botMessage = {
        _id: new Date().getTime() + 1,
        text: recipe,
        createdAt: new Date(),
        user: { _id: 2, name: 'Food Bot' }
      };
      setMessages(messages => [...messages, botMessage]);
    } catch (error) {
      console.error('Error fetching the recipe:', error);
      const errorMessage = {
        _id: new Date().getTime() + 1,
        text: `Error: ${error.response ? JSON.stringify(error.response.data, null, 2) : JSON.stringify(error.message)}`,
        createdAt: new Date(),
        user: { _id: 2, name: 'Food Bot' }
      };
      setMessages(messages => [...messages, errorMessage]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value.trim();
    if (text) {
      handleSend(text);
    }
    event.target.reset();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Food Bot</h2>
      </div>
      <div className="chatbot-messages">
        {messages.map(message => (
          <div key={message._id} className={`chatbot-message ${message.user._id === 1 ? 'user-message' : 'bot-message'}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form className="chatbot-input" onSubmit={handleSubmit}>
        <input type="text" name="text" placeholder="Type your food query here..." required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
