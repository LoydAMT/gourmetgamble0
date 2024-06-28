import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './App.css';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff5e6',
  },
  recipeOfTheDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto 20px auto',
  },
  recipeImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  recipeContent: {
    textAlign: 'center',
  },
  recipeTitle: {
    fontSize: '24px',
    margin: '10px 0',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  categoryTitle: {
    fontSize: '22px',
    margin: '20px 0 10px 0',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  recipeCardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  recipeCardContent: {
    padding: '10px',
    textAlign: 'center',
  },
  recipeCardTitle: {
    fontSize: '18px',
    margin: '10px 0',
  },
  recipeCardOrigin: {
    fontSize: '14px',
    color: '#666',
  },
};

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
      setRecipeOfTheDay(recipesData[Math.floor(Math.random() * recipesData.length)]);
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.nameOfDish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.nameOfUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedRecipes = filteredRecipes.reduce((acc, recipe) => {
    if (!acc[recipe.origin]) {
      acc[recipe.origin] = [];
    }
    acc[recipe.origin].push(recipe);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      {recipeOfTheDay && (
        <div style={styles.recipeOfTheDay}>
          <img src={recipeOfTheDay.photo} alt={recipeOfTheDay.nameOfDish} style={styles.recipeImage} />
          <div style={styles.recipeContent}>
            <h2 style={styles.recipeTitle}>{recipeOfTheDay.nameOfDish}</h2>
            <p>Recipe of the Day</p>
          </div>
        </div>
      )}
      <div style={styles.searchContainer}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name, origin, or uploader"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {Object.keys(groupedRecipes).map((origin) => (
        <div key={origin}>
          <h3 style={styles.categoryTitle}>{origin}</h3>
          <div style={styles.recipeGrid}>
            {groupedRecipes[origin].map((recipe) => (
              <div key={recipe.id} style={styles.recipeCard}>
                <img src={recipe.photo} alt={recipe.nameOfDish} style={styles.recipeCardImage} />
                <div style={styles.recipeCardContent}>
                  <h3 style={styles.recipeCardTitle}>{recipe.nameOfDish}</h3>
                  <p style={styles.recipeCardOrigin}>Uploaded by: {recipe.nameOfUser}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Recipes;
