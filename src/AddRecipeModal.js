import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './AddRecipeModal.css'; 

const AddRecipeModal = ({ showModal, setShowModal, onAddRecipe }) => {
  const [nameOfDish, setNameOfDish] = useState('');
  const [origin, setOrigin] = useState('');
  const [nameOfUser, setNameOfUser] = useState('');
  const [photo, setPhoto] = useState('');
  const [video, setVideo] = useState('');
  const [recipe, setRecipe] = useState('');  // Added the recipe state back
  const [description, setDescription] = useState('');
  const [recipeSteps, setRecipeSteps] = useState([{ value: '' }]);
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

  const handleStepChange = (value, index) => {
    const newSteps = [...recipeSteps];
    newSteps[index].value = value;
    setRecipeSteps(newSteps);
  };

  const addStep = () => {
    setRecipeSteps([...recipeSteps, { value: '' }]);
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
        description,
        ingredients: selectedIngredients,
        steps: recipeSteps.map(step => step.value),
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
      setRecipeSteps([{ value: '' }]);
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
    <div className="modalBackground">
      <div className="modalContainer">
        <h2>Add Recipe</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input className="input" type="text" placeholder="Name of dish" value={nameOfDish} onChange={(e) => setNameOfDish(e.target.value)} required />
          <textarea className="inputRecipe" placeholder="Dish Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" type="text" placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
          <input className="input" type="text" placeholder="Your name" value={nameOfUser} onChange={(e) => setNameOfUser(e.target.value)} required />
          <input className="input" type="url" placeholder="Photo URL" value={photo} onChange={(e) => setPhoto(e.target.value)} />
          <input className="input" type="url" placeholder="Video Tutorial URL" value={video} onChange={(e) => setVideo(e.target.value)} />
          <textarea className="inputRecipe" placeholder="Recipe Guide" value={recipe} onChange={(e) => setRecipe(e.target.value)} />
          {recipeSteps.map((step, index) => (
            <textarea
              key={index}
              className="inputSteps"
              placeholder={`Input Step ${index + 1}`}
              value={step.value}
              onChange={(e) => handleStepChange(e.target.value, index)}
            />
          ))}
          <button type="button" className="button addButton" onClick={addStep}>
            Add Step
          </button>
          <input className="searchInput" type="text" placeholder="Search Ingredients" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="ingredientList">
            {filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} className="ingredientItem">
                <input type="checkbox" checked={selectedIngredients.includes(ingredient.name)} onChange={() => handleIngredientChange(ingredient.name)} />
                <label>{ingredient.name}</label>
              </div>
            ))}
            {showNewIngredientForm && (
              <div className="ingredientItem">
                <input className="NewIngredient" type="text" placeholder="New Ingredient Name" value={newIngredientName} onChange={(e) => setNewIngredientName(e.target.value)} />
                <input className="NewIngredient" type="url" placeholder="Image URL" value={newIngredientImageURL} onChange={(e) => setNewIngredientImageURL(e.target.value)} />
                <button type="button" onClick={addNewIngredient}>
                  Add
                </button>
              </div>
            )}
          </div>
          <button type="button" className="button addButton" onClick={() => setShowNewIngredientForm(true)}>
            Add New Ingredient
          </button>
          <div className="buttonContainer">
            <button className="button addRecipeButton" type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Recipe'}
            </button>
            <button className="button cancelButton" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
