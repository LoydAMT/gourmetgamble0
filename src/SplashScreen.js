import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import 'animate.css/animate.min.css'; // Ensure animate.css is imported
import logo from './logo.png'; // Adjust the path as necessary

function SplashScreen({ onComplete }) {
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    
    const textTimeout = setTimeout(() => {
      setShowText(true);
      
    }, 1500); // 1.5 seconds for the logo animation

    // Start fade out animation after text animation completes
    const exitTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000); // Adjust the duration to match fade-out animation
    }, 3500); // 1.5 seconds for logo animation + 1.5 seconds for text animation + 0.5 second buffer

    return () => {
      clearTimeout(textTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'animate__animated animate__fadeOut' : ''}`}>
      <img
        src={logo}
        alt="Splash"
        className="splash-image animate__animated animate__heartBeat"
      />
      {showText && (
        <div className="splash-text animate__animated animate__jackInTheBox">
          Parlay Your Ingredients and Stake Your Meals
        </div>
      )}
    </div>
  );
}

export default SplashScreen;
