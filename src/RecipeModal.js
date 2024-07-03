import React from 'react';
import './RecipeModal.css';

const RecipeModal = ({ showModal, setShowModal, recipe }) => {
  if (!showModal) return null;

  const formatIngredients = (ingredients) => {
    return ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>);
  };

  const formatSteps = (steps) => {
    if (!Array.isArray(steps)) {
      console.error('steps should be an array');
      return null;
    }

    return steps.map((step, index) => (
      <div key={index} className="recipe-step">
        <h3>Step {index + 1}</h3>
        <p>{step}</p>
      </div>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => setShowModal(false)}>×</button>
        <h1 className="recipe-title">{recipe.nameOfDish}</h1>
        <p className="recipe-author">Uploader: {recipe.nameOfUser}</p>
        <p className="recipe-origin">Origin: {recipe.origin}</p>
        <div className="recipe-description">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>
        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            {formatIngredients(recipe.ingredients)}
          </ul>
        </div>
        <div className="recipe-recipe">
          <h2>Recipe Measurements</h2>
          <p>{recipe.recipe}</p>
        </div>
        <div className="recipe-steps">
          <h2>Steps</h2>
          {formatSteps(recipe.steps)}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
