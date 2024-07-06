import React, { useState } from 'react';

function ChatBot() {
    const [messages, setMessages] = useState([]);

    const receiveMessage = (newMessage) => {
        const formattedMessage = newMessage.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className="chatbot-message bot-message">{message}</div>
                ))}
            </div>
            <div className="chatbot-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
        </div>
    );
}

export default ChatBot;
