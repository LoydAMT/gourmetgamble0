import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import DishDetails from './DishDetails';
import './Recipes.css';  // Make sure to import your new CSS file

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
      setRecipeOfTheDay(recipesData[Math.floor(Math.random() * recipesData.length)]);
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.nameOfDish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.nameOfUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedRecipes = filteredRecipes.reduce((acc, recipe) => {
    if (!acc[recipe.origin]) {
      acc[recipe.origin] = [];
    }
    acc[recipe.origin].push(recipe);
    return acc;
  }, {});

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSimilarDishClick = (id) => {
    const selected = recipes.find(recipe => recipe.id === id);
    if (selected) {
      setSelectedRecipe(selected);
    }
  };

  return (
    <div className="recipes-container">
      {recipeOfTheDay && (
        <div className="recipe-of-the-day" onClick={() => openModal(recipeOfTheDay)}>
          <img
            src={recipeOfTheDay.photo || 'placeholder-image-url.jpg'}
            alt={recipeOfTheDay.nameOfDish}
            className="recipe-image"
          />
          <div className="content-block recipe-content">
            <h2 className="recipe-title">{recipeOfTheDay.nameOfDish}</h2>
            <p>Recipe of the Day</p>
          </div>
        </div>
      )}

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, origin, or uploader"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {Object.keys(groupedRecipes).map((origin) => (
        <div key={origin}>
          <h3 className="category-title">{origin}</h3>
          <div className="recipe-grid">
            {groupedRecipes[origin].map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => openModal(recipe)}
              >
                <img
                  src={recipe.photo || 'placeholder-image-url.jpg'}
                  alt={recipe.nameOfDish}
                  className="recipe-card-image"
                />
                <div className="recipe-card-content">
                  <h3 className="recipe-card-title">{recipe.nameOfDish}</h3>
                  <p className="recipe-card-origin">Uploaded by: {recipe.nameOfUser}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Recipe Details"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90%',
            padding: '0px',
            borderRadius: '20px',
          },
        }}
      >
        {selectedRecipe && <DishDetails recipe={selectedRecipe} onSimilarDishClick={handleSimilarDishClick} />}
      </Modal>
    </div>
  );
}

export default Recipes;
