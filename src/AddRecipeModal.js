// src/AddRecipeModal.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
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
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#ff9800',
    border: 'none',
    cursor: 'pointer',
  },
};

const AddRecipeModal = ({ showModal, setShowModal, onAddRecipe }) => {
  const [nameOfDish, setNameOfDish] = useState('');
  const [origin, setOrigin] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [photo, setPhoto] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = {
        nameOfDish,
        origin,
        nameOfUser,
        photo,
        ingredients: ingredients.split(','),
      };
      const docRef = await addDoc(collection(db, 'recipes'), newRecipe);
      onAddRecipe({ id: docRef.id, ...newRecipe });
      setShowModal(false);
      setNameOfDish('');
      setOrigin('');
      setNameOfUser('');
      setPhoto('');
      setIngredients('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (!showModal) return null;

  return (
    <div style={styles.modalBackground}>
      <div style={styles.modalContainer}>
        <h2>Add Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name of dish"
            value={nameOfDish}
            onChange={(e) => setNameOfDish(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Your name"
            value={nameOfUser}
            onChange={(e) => setNameOfUser(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Photo URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Add Recipe</button>
        </form>
        <button style={styles.button} onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
