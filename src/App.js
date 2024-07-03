import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Recipes from './Recipes';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import Community from './Community';
import Profile from './Profile';
import ContactUsModal from './ContactUsModal'; 
import AddRecipeModal from './AddRecipeModal';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

function App() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchRecipes();

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      authUnsubscribe();
    };
  }, []);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const handleLogout = async () => {
    await signOut(auth);
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
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

function AppContent({
  showPrivacyModal, setShowPrivacyModal,
  showAuthModal, setShowAuthModal,
  showAboutUsModal, setShowAboutUsModal,
  showContactUsModal, setShowContactUsModal,
  recipes, handleAddRecipe, showAddRecipeModal, setShowAddRecipeModal,
  currentUser, handleLogout
}) {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <button className="nav-item" onClick={() => navigate('/')}>
          Home
        </button>
        <button className="nav-item" onClick={() => navigate('/recipes')}>
          Recipes
        </button>
        <button className="nav-item" onClick={() => navigate('/community')}>
          Community
        </button>
        {currentUser ? (
          <>
            <button className="nav-item" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="nav-item" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="sign-in-button" onClick={() => setShowAuthModal(true)}>
            Sign in/Sign Up
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes recipes={recipes} />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
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

      <footer>
        <button className="footer-item" onClick={() => setShowAboutUsModal(true)}>
          About Us
        </button>
        <button className="footer-item" onClick={() => setShowContactUsModal(true)}>
          Contact Us
        </button>
        <button className="footer-item" onClick={() => setShowPrivacyModal(true)}>
          Privacy Policy
        </button>
      </footer>
    </div>
  );
}

export default App;
