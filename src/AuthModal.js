// AuthModal.js
import React, { useState } from 'react';
import { registerUser, loginUser, signInWithGoogle, db, getUserProfile } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './AuthModal.css';
import googleLogo from './google.png';
import ResetPasswordModal from './ResetPasswordModal'; // Import the reset password modal

const AuthModal = ({ showModal, setShowModal }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [culinaryExperience, setCulinaryExperience] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetPasswordShow, setResetPasswordShow] = useState(false); // State for reset password modal

  const handleSignUp = async () => {
    try {
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        email: user.email,
        culinaryExperience,
      });
      setSuccessMessage('Successfully registered!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setName('');
        setCulinaryExperience('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Error in registration: ' + error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await loginUser(email, password);
      setSuccessMessage('Successfully logged in!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setName('');
        setCulinaryExperience('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Error in login: ' + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if the user already exists in the database
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName || user.email,
          email: user.email,
        });
      }

      setSuccessMessage('Successfully logged in with Google!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Error logging in with Google: ' + error.message);
    }
  };

  const handlePasswordResetShow = () => {
    setResetPasswordShow(true);
  };

  if (!showModal) return null;

  return (
    <>
      <div className="modal-background">
        <div className="modal-container">
          <h2 className="LSHeader">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <p className="LSSubText">{isSignUp ? 'Enter your email to sign up for this app' : 'Login using email or other'}</p>
          {isSignUp && (
            <>
              <input
                className="input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="select"
                value={culinaryExperience}
                onChange={(e) => setCulinaryExperience(e.target.value)}
                required
              >
                <option value="">Do you have culinary experience?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </>
          )}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="button-container">
            {isSignUp ? (
              <>
                <button className="Sbutton" type="button" onClick={handleSignUp}>Create account</button>
                <button className="Sbutton" type="button" onClick={() => setIsSignUp(false)}>Back to Sign In</button>
              </>
            ) : (
              <>
                <button className="Sbutton" type="button" onClick={handleSignIn}>Login</button>
                <button className="Sbutton" type="button" onClick={() => setIsSignUp(true)}>Create Account</button>
              </>
            )}
          </div>
          <p className="GoogleLoginText">or login with</p>
          <button className="google-button" type="button" onClick={handleGoogleSignIn}>
            <img src={googleLogo} alt="Google Logo" className="google-logo" />
            Google
          </button>
          {!isSignUp && (
            <p className="mt-3">
              <a href="#" onClick={handlePasswordResetShow}>Forgot Password?</a>
            </p>
          )}
          <button className="Sbutton" onClick={() => setShowModal(false)}>Cancel</button>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal show={resetPasswordShow} handleClose={() => setResetPasswordShow(false)} />
    </>
  );
};




export default AuthModal;
