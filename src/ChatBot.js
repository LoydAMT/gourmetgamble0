import React, { useState, useEffect } from 'react';
import Groq from 'groq-sdk';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true  // Allow usage in browser environment
  });

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

    // Lowercase text for easier comparison
    const messageText = text.toLowerCase();

    // Define an extensive list of food-related keywords
    const foodKeywords = [
      'recipe', 'food', 'breakfast', 'lunch', 'dinner', 'fruit', 'vegetable', 'meal', 'cook', 'ingredient', 'dish', 
      'cuisine', 'healthy', 'snack', 'dessert', 'appetizer', 'main course', 'beverage', 'drink', 'smoothie', 'shake', 
      'grill', 'bake', 'roast', 'fry', 'boil', 'steam', 'saute', 'braise', 'stew', 'soup', 'salad', 'sauce', 'condiment', 
      'marinade', 'dip', 'spread', 'pastry', 'bread', 'cake', 'pie', 'tart', 'pudding', 'ice cream', 'sorbet', 'cookie', 
      'biscuit', 'sandwich', 'burger', 'pizza', 'pasta', 'noodle', 'rice', 'grain', 'cereal', 'oatmeal', 'porridge', 
      'protein', 'carb', 'fiber', 'vitamin', 'mineral', 'nutrient', 'calorie', 'diet', 'vegan', 'vegetarian', 'gluten-free', 
      'dairy-free', 'nut-free', 'paleo', 'keto', 'low-carb', 'low-fat', 'low-sugar', 'organic', 'non-gmo', 'farm-to-table', 
      'locally-sourced', 'seasonal', 'ethnic', 'international', 'fusion', 'gourmet', 'fine dining', 'comfort food', 
      'fast food', 'street food', 'homemade', 'quick', 'easy', 'simple', 'budget', 'economical', 'leftovers', 'meal prep', 
      'batch cooking', 'family-friendly', 'kid-friendly', 'party', 'celebration', 'holiday', 'festival', 'tradition', 
      'regional', 'specialty', 'artisan', 'farm', 'garden', 'fresh', 'frozen', 'canned', 'preserved', 'pickled', 'fermented', 
      'spices', 'herbs', 'aromatics', 'flavor', 'taste', 'texture', 'presentation', 'plating', 'garnish', 'food styling'
    ];

    if (foodKeywords.some(keyword => messageText.includes(keyword))) {
      // Send the query to the Groq API for food-related queries
      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: messageText,
            },
          ],
          model: "gemma-7b-it",
        });

        const recipe = response.choices[0]?.message?.content.trim() || 'Sorry, I could not find a recipe for that.';
        const formattedRecipe = recipe.replace(/\n/g, '<br/>');

        const botMessage = {
          _id: new Date().getTime(),
          text: formattedRecipe,
          createdAt: new Date(),
          user: { _id: 2, name: 'Food Bot' }
        };
        setMessages(messages => [...messages, botMessage]);
      } catch (error) {
        console.error('Error fetching the recipe:', error);
        const errorMessage = {
          _id: new Date().getTime(),
          text: `Error: ${error.message}`,
          createdAt: new Date(),
          user: { _id: 2, name: 'Food Bot' }
        };
        setMessages(messages => [...messages, errorMessage]);
      }
    } else {
      const botMessage = {
        _id: new Date().getTime(),
        text: "I'm still learning, please ask me about food and recipes only.",
        createdAt: new Date(),
        user: { _id: 2, name: 'Food Bot' }
      };
      setMessages(messages => [...messages, botMessage]);
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
          <div key={message._id} className={`chatbot-message ${message.user._id === 1 ? 'user-message' : 'bot-message'}`}
               dangerouslySetInnerHTML={{ __html: message.text }} />
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
