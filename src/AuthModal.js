import React, { useState } from 'react';
import { registerUser, loginUser, signInWithGoogle, db, getUserProfile } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './App.css';

const styles = {
  modalBackground: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    width: '96%',
    fontSize: '16px',
  },
  select: {
    marginBottom: '10px',
    padding: '10px',
    width: '100%',
    fontSize: '16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: '10px',
    backgroundColor: '#ff9800',
    border: 'none',
    cursor: 'pointer',
    width: '48%',
  },
  googleButton: {
    padding: '10px',
    backgroundColor: '#4285F4',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    color: '#fff',
    marginBottom: '10px',
    marginTop: '10px',
  },
  successMessage: {
    color: 'green',
    marginTop: '20px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '20px',
  },
};

const AuthModal = ({ showModal, setShowModal }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [culinaryExperience, setCulinaryExperience] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  if (!showModal) return null;

  return (
    <div style={styles.modalBackground}>
      <div style={styles.modalContainer}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {isSignUp && (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              style={styles.select}
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
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={styles.buttonContainer}>
          {isSignUp ? (
            <>
              <button style={styles.button} type="button" onClick={handleSignUp}>Save</button>
              <button style={styles.button} type="button" onClick={() => setIsSignUp(false)}>Sign In</button>
            </>
          ) : (
            <>
              <button style={styles.button} type="button" onClick={handleSignIn}>Sign In</button>
              <button style={styles.button} type="button" onClick={() => setIsSignUp(true)}>Sign Up</button>
            </>
          )}
        </div>
        <button style={styles.googleButton} type="button" onClick={handleGoogleSignIn}>Sign in with Google</button>
        <button style={styles.button} onClick={() => setShowModal(false)}>Cancel</button>
        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AuthModal;
