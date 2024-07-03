import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddRecipeModal from './AddRecipeModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
import { Carousel } from 'react-responsive-carousel';
import RecipeSlideshow from './RecipeSlideshow';
import ChatBot from './ChatBot';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import IngredientList from './IngredientList';
import './Home.css';

function Home() {
  const ingredientCardsRef = useRef(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredientsList = querySnapshot.docs.map(doc => doc.data());
      setIngredients(ingredientsList);
    };

    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchIngredients();
    fetchRecipes();
  }, []);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => prev.includes(ingredient) ? 
      prev.filter(item => item !== ingredient) : [...prev, ingredient]);
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecipes = recipes.filter(recipe =>
    selectedIngredients.every(ingredient =>
      recipe.ingredients.includes(ingredient)
    )
  );

  return (
    <div className="container">
      <main className="main-content">
        <div className="left-column">
          <h1 className="main-heading">Parlay Your Ingredients and<br />Stake Your Meals.</h1>
          <input
            className="search-bar"
            type="text"
            placeholder="Search Ingredient Here"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="ingredient-cards-container">
            <button className="scroll-button left-scroll-button" onClick={() => ingredientCardsRef.current.scrollLeft -= 150}>{'<'}</button>
            <div className="ingredient-cards" ref={ingredientCardsRef}>
              {filteredIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`card ${selectedIngredients.includes(ingredient.name) ? 'selected-card' : ''}`}
                  onClick={() => toggleIngredient(ingredient.name)}
                >
                  <img src={ingredient.imageURL} alt={ingredient.name} className="card-image" />
                  <p>{ingredient.name}</p>
                </div>
              ))}
            </div>
            <button className="scroll-button right-scroll-button" onClick={() => ingredientCardsRef.current.scrollLeft += 150}>{'>'}</button>
          </div>
          <div className="filtered-recipes">
            {filteredRecipes.slice(0, 3).map((recipe) => (
              <div key={recipe.id} className="filtered-recipe-card">
                <h2>{recipe.nameOfDish}</h2>
                <img src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`} alt={recipe.nameOfDish} className="filtered-recipe-photo" />
                <IngredientList ingredients={recipe.ingredients} />
              </div>
            ))}
          </div>
        </div>
        <div className="right-column">
          <RecipeSlideshow />
        </div>
      </main>
      <AddRecipeModal showModal={showModal} setShowModal={setShowModal} onAddRecipe={handleAddRecipe} />
      <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
      <AboutUsModal showModal={showAboutUsModal} setShowModal={setShowAboutUsModal} />
      <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />
      
      {/* ChatBot Floating Button */}
      <button className="chatbot-button" onClick={() => setShowChatBot(!showChatBot)}>💬</button>
      {showChatBot && <ChatBot />}
    </div>
  );
}

export default Home;
