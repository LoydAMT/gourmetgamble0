import React, { useMemo } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const Chat = () => {
    const steps = useMemo(() => [
        {
            id: '0',
            message: 'Welcome to GourmetGamble!',
            trigger: '1',
        },
        {
            id: '1',
            message: 'Where you can parlay your ingredients and stake your meals.',
            trigger: '2',
        },
        {
            id: '2',
            message: 'What can I help you with today?',
            trigger: '3',
        },
        {
            id: '3',
            options: [
                { value: 1, label: 'View Recipes', trigger: '4' },
                { value: 2, label: 'Popular Recipe', trigger: '4' },
            ],
        },
        {
            id: '4',
            message: 'You selected {previousValue}. How else can I assist you?',
            trigger: '5'
        },
        {
            id: '5',
            options: [
                { value: 1, label: 'More Information', trigger: '6' },
                { value: 2, label: 'Start Over', trigger: '0' },
            ],
        },
        {
            id: '6',
            message: 'Here is some more information...',
            end: true,
        }
    ], []);
    
    // Define the theme for the chatbot
    const theme = useMemo(() => ({
        background: '#FBE9E7',
        fontFamily: 'Helvetica Neue',
        headerBgColor: '#4CAF50',
        headerFontColor: '#fff',
        headerFontSize: '15px',
        botBubbleColor: '#FFCCBC',
        botFontColor: '#4a4a4a',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
    }), []);

    // Configuration for the chatbot component
    const config = {
        botAvatar: 'avatar.png',
        floating: true,
        placeholder: 'Type your message...',
        headerTitle: 'Cooking Ina',
    };

    return (
        <ThemeProvider theme={theme}>
            <ChatBot steps={steps} {...config} />
        </ThemeProvider>
    );
}

export default Chat;
