import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddRecipeModal from './AddRecipeModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
import RecipeSlideshow from './RecipeSlideshow';
import ChatBot from './ChatBot';
import IngredientList from './IngredientList';
import SplashScreen from './SplashScreen';
import './Home.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'animate.css/animate.min.css'; // Import Animate.css

function Home() {
  const ingredientCardsRef = useRef(null);
  const filteredRecipesRef = useRef(null);
  const recipeListRef = useRef(null);
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
  const [showSplash, setShowSplash] = useState(() => sessionStorage.getItem("splashComplete") !== "true");
  const [isMobile, setIsMobile] = useState(false);

  const fetchIngredients = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredientsList = querySnapshot.docs.map((doc) => doc.data());
      setIngredients(ingredientsList);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }, []);

  const fetchRecipes = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
    fetchRecipes();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fetchIngredients, fetchRecipes]);

  const scroll = (direction, ref, items) => {
    if (direction === 'left') {
      if (ref.current.scrollLeft === 0) {
        ref.current.scrollLeft = ref.current.scrollWidth;
      } else {
        ref.current.scrollBy({ left: -150, behavior: 'smooth' });
      }
    } else {
      if (ref.current.scrollLeft + ref.current.clientWidth >= ref.current.scrollWidth) {
        ref.current.scrollLeft = 0;
      } else {
        ref.current.scrollBy({ left: 150, behavior: 'smooth' });
      }
    }
  };

  const handleAddRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      if (prevSelectedIngredients.includes(ingredient)) {
        return prevSelectedIngredients.filter((item) => item !== ingredient);
      } else {
        return [...prevSelectedIngredients, ingredient];
      }
    });
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecipes = recipes.filter((recipe) =>
    selectedIngredients.every((ingredient) =>
      recipe.ingredients.includes(ingredient)
    )
  );

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashComplete", "true");
  };

  return (
    <div className="container">
      { 
      showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : 
      (
        <div className={`animate__animated animate__fadeIn`}>
          <main className="main-content">
            <div className="left-column">
              <h1 className="main-heading">
                Parlay Your Ingredients and Stake Your Meals.
              </h1>
              <p className="sub-heading">
                Parlay Your Ingredients and Stake Your Meals on Winning Recipes.
              </p>
              <input
                className="search-bar"
                type="text"
                placeholder="Search Ingredient Here"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="ingredient-cards-container">
                <button
                  className="scroll-button left-scroll-button"
                  onClick={() => scroll('left', ingredientCardsRef)}
                >
                  {'<'}
                </button>
                <div className="ingredient-cards" ref={ingredientCardsRef}>
                  {filteredIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className={`card ${selectedIngredients.includes(ingredient.name) ? 'selected-card' : ''}`}
                      onClick={() => toggleIngredient(ingredient.name)}
                    >
                      <img
                        src={ingredient.imageURL}
                        alt={ingredient.name}
                        className="card-image"
                      />
                      <p>{ingredient.name}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="scroll-button right-scroll-button"
                  onClick={() => scroll('right', ingredientCardsRef)}
                >
                  {'>'}
                </button>
              </div>
              {selectedIngredients.length > 0 && (
                <div className="filtered-recipes-container">
                  <button
                    className="scroll-button left-scroll-button"
                    onClick={() => scroll('left', filteredRecipesRef)}
                  >
                    {'<'}
                  </button>
                  <div className="filtered-recipes" ref={filteredRecipesRef}>
                    {filteredRecipes.map((recipe) => (
                      <div key={recipe.id} className="filtered-recipe-card">
                        <h2>{recipe.nameOfDish}</h2>
                        <img src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`} alt={recipe.nameOfDish} className="filtered-recipe-photo" />
                        <IngredientList ingredients={recipe.ingredients} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="scroll-button right-scroll-button"
                    onClick={() => scroll('right', filteredRecipesRef)}
                  >
                    {'>'}
                  </button>
                </div>
              )}
            </div>
            <div className="right-column">
              <div className="main-image">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93dbb781c0deb85382084d502707c0bc26e5e707b4a196271d30a9e2163dd7d2?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Taco Platter" className="main-image-content" />
                <div className="discover-more-container">
                  <button className="star-icon">★</button>
                  <button className="discover-button" onClick={() => setShowModal(true)}>Add Recipe</button>
                </div>
              </div>
              <div>
                <RecipeSlideshow />
              </div>
            </div>
          </main>
          <div className="recipe-list-container">
            <button
              className="scroll-button left-scroll-button"
              onClick={() => scroll('left', recipeListRef)}
            >
              {'<'}
            </button>
            <div className="recipe-list" ref={recipeListRef}>
              {(isMobile ? [...recipes, ...recipes] : recipes).map((recipe, index) => (
                <div key={index} className="recipe-card">
                  <h2>{recipe.nameOfDish}</h2>
                  <img src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`} alt={recipe.nameOfDish} className="recipe-photo" />
                  <IngredientList ingredients={recipe.ingredients} />
                </div>
              ))}
            </div>
            <button
              className="scroll-button right-scroll-button"
              onClick={() => scroll('right', recipeListRef)}
            >
              {'>'}
            </button>
          </div>
          <AddRecipeModal showModal={showModal} setShowModal={setShowModal} onAddRecipe={handleAddRecipe} />
          <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
          <AuthModal showModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
          <AboutUsModal showModal={showAboutUsModal} setShowAboutUsModal={setShowAboutUsModal} />
          <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />
          {/* ChatBot Floating Button */}
          <button className="chatbot-button" onClick={() => setShowChatBot(!showChatBot)}>💬</button>
          {showChatBot && <ChatBot />}
        </div>
      )}
    </div>
  );
}

export default Home;
