import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Recipes from './Recipes';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
import AddRecipeModal from './AddRecipeModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './App.css';

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginLeft: '15%',
    marginRight: '15%',
    alignItems: 'center',
    marginBottom: '0px',
    padding: '20px',
    gap: '20px',
    backgroundColor: 'transparent', 
  },
  navItem: {
    fontSize: '22px',
    color: '#143501',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
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
  userContainer: {
    position: 'absolute',
    top: '20px',
    right: '50px',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  userImage: {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
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
    margin: '0px 130px',
    height: '30px',
    marginBottom: 'auto',
    color: '#143501',
    fontSize: '18px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderColor: 'transparent',
  },
};

function App() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchRecipes();
  }, []);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  return (
    <Router>
      <AppContent
        showPrivacyModal={showPrivacyModal}
        setShowPrivacyModal={setShowPrivacyModal}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        showAboutUsModal={showAboutUsModal}
        setShowAboutUsModal={setShowAboutUsModal}
        showContactUsModal={showContactUsModal}
        setShowContactUsModal={setShowContactUsModal}
        recipes={recipes}
        handleAddRecipe={handleAddRecipe}
        showAddRecipeModal={showAddRecipeModal}
        setShowAddRecipeModal={setShowAddRecipeModal}
      />
    </Router>
  );
}

function AppContent({
  showPrivacyModal, setShowPrivacyModal,
  showAuthModal, setShowAuthModal,
  showAboutUsModal, setShowAboutUsModal,
  showContactUsModal, setShowContactUsModal,
  recipes, handleAddRecipe, showAddRecipeModal, setShowAddRecipeModal
}) {
  const navigate = useNavigate();

  return (
    <div>
      <nav style={styles.nav}>
        <button style={styles.navItem} onClick={() => navigate('/')}>
          Home
        </button>
        <button style={styles.navItem} onClick={() => navigate('/recipes')}>
          Recipes
        </button>
        <button style={styles.navItem}>Community</button>
        <button style={styles.navItem}>Chat</button>
        <button style={styles.signInButton} onClick={() => setShowAuthModal(true)}>
          Sign in/Sign Up
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes recipes={recipes} />} />
      </Routes>

      <AddRecipeModal
        showModal={showAddRecipeModal}
        setShowModal={setShowAddRecipeModal}
        onAddRecipe={handleAddRecipe}
      />

      <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
      <AboutUsModal showModal={showAboutUsModal} setShowModal={setShowAboutUsModal} />
      <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />
    </div>
  );
}

export default App;
