import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputRecipe: {
    marginBottom: '20px',
    padding: '0px',
    width: '100%',
    fontSize: '16px',
    height: '100px',
    resize: 'vertical',
  },
  input: {
    marginBottom: '10px',
    padding: '0px',
    width: '100%',
    fontSize: '16px',
  },
  searchInput: {
    marginBottom: '10px',
    padding: '0px',
    width: '100%',
    fontSize: '16px',
  },
  ingredientList: {
    marginBottom: '20px',
    width: '95%',
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
  },
  ingredientItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    width: '48%',
  },
  addButton: {
    backgroundColor: '#ff9800',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
};

const AddRecipeModal = ({ showModal, setShowModal, onAddRecipe }) => {
  const [nameOfDish, setNameOfDish] = useState('');
  const [origin, setOrigin] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [photo, setPhoto] = useState('');
  const [video, setVideo] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientImageURL, setNewIngredientImageURL] = useState('');
  const [showNewIngredientForm, setShowNewIngredientForm] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ingredients'));
        const ingredientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageURL: doc.data().imageURL,
        }));
        setAvailableIngredients(ingredientsList);
      } catch (error) {
        console.error('Error fetching ingredients: ', error);
      }
    };

    fetchIngredients();
  }, []);

  const filteredIngredients = availableIngredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIngredientChange = (ingredientName) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientName)
        ? prevSelected.filter((item) => item !== ingredientName)
        : [...prevSelected, ingredientName]
    );
  };

  const addNewIngredient = async () => {
    if (newIngredientName.trim() === '') {
      alert('Please enter the name for the new ingredient.');
      return;
    }

    if (!isValidImageUrl(newIngredientImageURL.trim())) {
      alert('Please enter a valid image URL for the new ingredient.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'ingredients'), {
        name: newIngredientName.trim(),
        imageURL: newIngredientImageURL.trim(),
      });
      const newIngredientId = docRef.id;
      setAvailableIngredients((prevIngredients) => [
        ...prevIngredients,
        { id: newIngredientId, name: newIngredientName.trim(), imageURL: newIngredientImageURL.trim() },
      ]);
      setSelectedIngredients((prevSelected) => [...prevSelected, newIngredientName.trim()]);
      setNewIngredientName('');
      setNewIngredientImageURL('');
      setShowNewIngredientForm(false);
    } catch (error) {
      console.error('Error adding new ingredient: ', error);
      alert('Failed to add new ingredient. Please try again.');
    }
  };

  const isValidImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newRecipe = {
        nameOfDish,
        origin,
        nameOfUser,
        photo,
        video,
        recipe,
        ingredients: selectedIngredients,
      };
      const docRef = await addDoc(collection(db, 'recipes'), newRecipe);
      onAddRecipe({ id: docRef.id, ...newRecipe });
      setShowModal(false);
      setNameOfDish('');
      setOrigin('');
      setNameOfUser('');
      setPhoto('');
      setVideo('');
      setRecipe('');
      setSelectedIngredients([]);
      setSearchQuery('');
    } catch (error) {
      setError('Error adding document. Please try again.');
      console.error('Error adding document: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div style={styles.modalBackground}>
      <div style={styles.modalContainer}>
        <h2>Add Recipe</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            type="url"
            placeholder="Photo URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
          <input
            style={styles.input}
            type="url"
            placeholder="Video Tutorial URL"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />
          <textarea
            style={styles.inputRecipe}
            placeholder="Recipe Guide"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
            rows="5"
          />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search Ingredients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={styles.ingredientList}>
            {filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} style={styles.ingredientItem}>
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.name)}
                  onChange={() => handleIngredientChange(ingredient.name)}
                />
                <label>{ingredient.name}</label>
              </div>
            ))}
            {showNewIngredientForm && (
              <div style={styles.ingredientItem}>
                <input
                  type="text"
                  placeholder="New Ingredient Name"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newIngredientImageURL}
                  onChange={(e) => setNewIngredientImageURL(e.target.value)}
                />
                <button type="button" onClick={addNewIngredient}>
                  Add
                </button>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setShowNewIngredientForm(true)}>
            Add New Ingredient
          </button>
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.addButton }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Recipe'}
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
