import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import AuthModal from './AuthModal';
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
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

  return (
    <Router>
      <div>
        <nav style={styles.nav}>
          <button style={styles.navItem} onClick={() => window.location.href = '/'}>
            Home
          </button>
          <button style={styles.navItem}>Recipe</button>
          <button style={styles.navItem}>Community</button>
          <button style={styles.navItem}>Chat</button>
          <button style={styles.signInButton} onClick={() => setShowAuthModal(true)}>Sign in/Sign Up</button>
        </nav>
        <button style={styles.userContainer}>
          <img
            style={styles.userImage}
            src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
            alt="User"
          />
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add other routes here */}
        </Routes>

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

        <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
        <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
        <AboutUsModal showModal={showAboutUsModal} setShowModal={setShowAboutUsModal} />
        <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />
      </div>
    </Router>
  );
}

export default App;
