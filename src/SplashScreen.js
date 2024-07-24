import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import 'animate.css/animate.min.css'; 
import logo from './logo.png'; 

function SplashScreen({ onComplete, isComplete }) {
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isComplete) {
      onComplete();
      return;
    }

    const textTimeout = setTimeout(() => {
      setShowText(true);
    }, 1500); 

    const exitTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000); 
    }, 3500); 

    return () => {
      clearTimeout(textTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onComplete, isComplete]);

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
