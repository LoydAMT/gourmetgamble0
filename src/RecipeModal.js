import React from 'react';
import './RecipeModal.css';

const RecipeModal = ({ showModal, setShowModal, recipe }) => {
  if (!showModal) return null;

  const formatIngredients = (ingredients) => {
    return ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>);
  };

  const formatSteps = (steps) => {
    return steps.split('Step ').map((step, index) => step && (
      <div key={index} className="recipe-step">
        <h3>Step {index}</h3>
        <p>{step}</p>
      </div>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => setShowModal(false)}>×</button>
        <h1 className="recipe-title">{recipe.nameOfDish}</h1>
        <p className="recipe-author">BY {recipe.nameOfUser}</p>
        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            {formatIngredients(recipe.ingredients)}
          </ul>
        </div>
        <div className="recipe-steps">
          <h2>Steps</h2>
          {formatSteps(recipe.recipe)}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
