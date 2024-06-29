import React from 'react';
import './DishDisplay.css';

const DishDisplay = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <div className="dish-display">
      <div className="dish-card">
        <div className="dish-photo">
          <img src={recipe.photo || 'placeholder-image-url.jpg'} alt={recipe.nameOfDish} />
        </div>
        <div className="dish-info">
          <h1>{recipe.nameOfDish}</h1>
          <p>BY {recipe.nameOfUser}</p>
          <button>OPEN RECIPE BUTTON</button>
          <div className="actions">
            <button>★</button>
            <button>🔖</button>
          </div>
          <p className="description">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DishDisplay;
