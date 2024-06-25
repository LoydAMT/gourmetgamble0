// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AddRecipeModal from './AddRecipeModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal'; // Import the AuthModal component
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
import './App.css';


const styles = {
  container: {
    background: 'linear-gradient(90deg, #f6d8b0 0%, #f9ec8d 58%, #fcff6d 100%)',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginLeft: '15%',
    marginRight: '15%',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    gap: '20px',
  },
  navItem: {
    fontSize: '22px',
    color: '#143501',
    cursor: 'pointer',
  },
  signInButton: {
    backgroundColor: '#ffa62f',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    fontSize: '22px',
    color: '#143501',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    padding: '20px',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '50%',
  },
  mainHeading: {
    fontSize: '48px',
    color: '#143501',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '18px',
    color: '#828282',
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: 'rgba(127, 250, 116, 0.87)',
    marginBottom: '20px',
  },
  ingredientCardsContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingLeft: '20px', // Adjusted padding to move everything to the right by 40 pixels
  },
  ingredientCards: {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
    paddingBottom: '20px',
    scrollBehavior: 'smooth',
  },
  card: {
    backgroundColor: '#f0bc77',
    borderRadius: '20px',
    padding: '5px', // Reduced from 20px
    textAlign: 'center',
    minWidth: '100px', // Reduced from 150px
    cursor: 'pointer',
  },
  selectedCard: {
    backgroundColor: '#4A90E2', // Blue color for selected ingredient
  },
  cardImage: {
    width: '100px', // Reduced from 100px
    height: '100px', // Reduced from 100px
    borderRadius: '50%',
    marginBottom: '0px',
  },
  scrollButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  leftScrollButton: {
    left: '0px', // Ensures it's on screen
  },
  rightScrollButton: {
    right: '-50px',
  },
  rightColumn: {
    width: '45%',
  },
  mainImage: {
    height: '300px',
    backgroundColor: '#ccc',
    borderRadius: '20px',
    marginBottom: '20px',
    position: 'relative',
  },
  mainImageContent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discoverMoreContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  starIcon: {
    backgroundColor: '#143501',
    color: '#fcff6d',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
  },
  discoverButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  ratingsSection: {
    backgroundColor: '#143501',
    borderRadius: '20px',
    padding: '20px',
    color: 'white',
  },
  ratingsHeading: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  ratingsImage: {
    width: '100%',
    borderRadius: '10px',
  },
  recipeList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    padding: '20px',
    width: '250px',
    textAlign: 'center',
  },
  recipePhoto: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  ingredientList: {
    listStyle: 'none',
    padding: 0,
  },
  contactCard: {
    display: 'flex',
    background: 'linear-gradient(to right, #FBBC05 0%, #F3E5BC 54%, #FBBC05 100%)',
    marginBottom: 'auto',
    height: '30px',
    justifyContent: 'space-between',
    width: '100%',
  },

  footerItem: {
    display: 'flex',
    margin: '0px 150px',
    height: '30px',
    marginBottom: 'auto',
    color: '#143501',
    fontSize: '18px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderColor: 'transparent',
  },
  filteredRecipes: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
  },
  filteredRecipeCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    padding: '20px',
    width: '250px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  filteredRecipePhoto: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  filteredIngredientList: {
    listStyle: 'none',
    padding: 0,
  },


};
function App() {
  const ingredientCardsRef = useRef(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false); // Add state for AboutUs modal
  const [showContactUsModal, setShowContactUsModal] = useState(false); // Add state for AboutUs modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // Add state for AuthModal

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ingredients'));
        const ingredientsList = querySnapshot.docs.map((doc) => doc.data());
        setIngredients(ingredientsList);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchIngredients();
    fetchRecipes();
  }, []);

  const scroll = (direction) => {
    if (direction === 'left') {
      ingredientCardsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    } else {
      ingredientCardsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
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
  ).slice(0, 3);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navItem}>Home</div>
        <div style={styles.navItem}>Recipe</div>
        <div style={styles.navItem}>Pantry</div>
        <div style={styles.navItem}>Community</div>
        <div style={styles.navItem}>Chat</div>
        <button style={styles.signInButton} onClick={() => setShowAuthModal(true)}>Sign in/Sign Up</button> {/* Added onClick handler */}
      </nav>

      <main style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <h1 style={styles.mainHeading}>
            Parlay Your Ingredients and<br />Stake Your Meals.
          </h1>
          <p style={styles.subHeading}>
            Parlay Your Ingredients and Stake Your Meals on Winning Recipes.
          </p>
          <input 
            style={styles.searchBar} 
            type="text" 
            placeholder="Search Ingredient Here"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div style={styles.ingredientCardsContainer}>
            <button 
              style={{ ...styles.scrollButton, ...styles.leftScrollButton }}
              onClick={() => scroll('left')}
            >
              {'<'}
            </button>
            <div style={styles.ingredientCards} ref={ingredientCardsRef}>
              {filteredIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.card,
                    ...(selectedIngredients.includes(ingredient.name) ? styles.selectedCard : {})
                  }}
                  onClick={() => toggleIngredient(ingredient.name)}
                >
                  <img
                    src={ingredient.imageURL}
                    alt={ingredient.name}
                    style={styles.cardImage}
                  />
                  <p>{ingredient.name}</p>
                </div>
              ))}
            </div>
            <button 
              style={{ ...styles.scrollButton, ...styles.rightScrollButton }}
              onClick={() => scroll('right')}
            >
              {'>'}
            </button>
          </div>
          
          <div style={styles.filteredRecipes}>
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} style={styles.filteredRecipeCard}>
                <h2>{recipe.nameOfDish}</h2>
                <img src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`} alt={recipe.nameOfDish} style={styles.filteredRecipePhoto} />
                <ul style={styles.filteredIngredientList}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.rightColumn}>
          <div style={styles.mainImage}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93dbb781c0deb85382084d502707c0bc26e5e707b4a196271d30a9e2163dd7d2?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Taco Platter" style={styles.mainImageContent} />
            <div style={styles.discoverMoreContainer}>
              <div style={styles.starIcon}>★</div>
              <button style={styles.discoverButton} onClick={() => setShowModal(true)}>Discover More</button>
            </div>
          </div>
          <div style={styles.ratingsSection}>
            <h2 style={styles.ratingsHeading}>999+ Ratings</h2>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93dbb781c0deb85382084d502707c0bc26e5e707b4a196271d30a9e2163dd7d2?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Food" style={styles.ratingsImage} />
          </div>
        </div>
      </main>

      <div style={styles.recipeList}>
        {recipes.map((recipe) => (
          <div key={recipe.id} style={styles.recipeCard}>
            <h2>{recipe.nameOfDish}</h2>
            <img src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`} alt={recipe.nameOfDish} style={styles.recipePhoto} />
            <ul style={styles.ingredientList}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={styles.contactCard}>
<button style={styles.footerItem} onClick={() => setShowPrivacyModal(true)}>
            Privacy Policy
          </button>
          <button style={styles.footerItem} onClick={() => setShowAboutUsModal(true)}>
            About Us
          </button>
          <button style={styles.footerItem}>Feedback</button>
          <button style={styles.footerItem} onClick={() => setShowContactUsModal(true)}>
            Contact us
          </button>
      </div>

      <AddRecipeModal showModal={showModal} setShowModal={setShowModal} onAddRecipe={handleAddRecipe} />
      <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} /> {/* Add the AuthModal component */}
      <AboutUsModal showModal={showAboutUsModal} setShowModal={setShowAboutUsModal} />
      <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />
    </div>
  );
}

export default App;