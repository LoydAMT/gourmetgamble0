import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Recipes from './Recipes';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import Community from './Community';
import Profile from './Profile';
import StalkProfile from './StalkProfile';
import ContactUsModal from './ContactUsModal';
import AddRecipeModal from './AddRecipeModal';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth, getUserProfile } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import defaultProfilePicture from './user.png';

function App() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchRecipes();

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setCurrentUser(user);
        setProfilePicture(userProfile?.profilePicture || defaultProfilePicture);
      } else {
        setCurrentUser(null);
        setProfilePicture(defaultProfilePicture);
      }
    });

    return () => {
      authUnsubscribe();
    };
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
        currentUser={currentUser}
        profilePicture={profilePicture}
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
  currentUser, profilePicture
}) {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="nav-bar">
        <div className="nav-items-center">
          <button className="nav-item" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="nav-item" onClick={() => navigate('/recipes')}>
            Recipes
          </button>
          <button className="nav-item" onClick={() => navigate('/community')}>
            Community
          </button>
        </div>
        <div className="nav-item-right">
          {currentUser ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="profile-picture-nav"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <button className="sign-in-button" onClick={() => setShowAuthModal(true)}>
              Sign in/Sign Up
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes recipes={recipes} />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<StalkProfile />} />
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
