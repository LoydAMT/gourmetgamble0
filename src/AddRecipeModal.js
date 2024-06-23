import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
};

const AddRecipeModal = ({ onClose, onAddRecipe }) => {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [photo, setPhoto] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      origin,
      nameOfUser,
      photo,
      ingredients: ingredients.split(',').map(ingredient => ingredient.trim()), // Convert to array
    };

    const docRef = await addDoc(collection(db, 'recipes'), newRecipe);

    onAddRecipe({ id: docRef.id, ...newRecipe });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Recipe name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button style={styles.button} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
