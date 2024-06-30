import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import DishDetails from './DishDetails';
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
    maxHeight: '500px',
    margin: '0 auto 20px auto',
  },
  recipeImage: {
    width: '400px',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  recipeContent: {
    textAlign: 'center',
    marginTop: '10px',
  },
  recipeTitle: {
    fontSize: '24px',
    margin: '10px 0',
  },
  searchContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    width: '80%',
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

// Media queries for responsiveness
const responsiveStyles = `
  @media (min-width: 600px) {
    .recipeGrid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    .searchInput {
      width: 60%;
    }
  }

  @media (min-width: 768px) {
    .recipeGrid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
    .searchInput {
      width: 50%;
    }
  }

  @media (min-width: 1024px) {
    .recipeGrid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    .searchInput {
      width: 40%;
    }
  }
`;

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveStyles}</style>
      {recipeOfTheDay && (
        <div style={styles.recipeOfTheDay}>
          <div style={{ width: '100%', position: 'relative' }}>
            <img
              src={recipeOfTheDay.photo || 'placeholder-image-url.jpg'}
              alt={recipeOfTheDay.nameOfDish}
              style={styles.recipeImage}
            />
          </div>
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
          <div className="recipeGrid" style={styles.recipeGrid}>
            {groupedRecipes[origin].map((recipe) => (
              <div
                key={recipe.id}
                style={styles.recipeCard}
                onClick={() => openModal(recipe)}
              >
                <img
                  src={recipe.photo || 'placeholder-image-url.jpg'}
                  alt={recipe.nameOfDish}
                  style={styles.recipeCardImage}
                />
                <div style={styles.recipeCardContent}>
                  <h3 style={styles.recipeCardTitle}>{recipe.nameOfDish}</h3>
                  <p style={styles.recipeCardOrigin}>Uploaded by: {recipe.nameOfUser}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Recipe Details"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90%',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
      >
        {selectedRecipe && <DishDetails recipe={selectedRecipe} />}
      </Modal>
    </div>
  );
}

export default Recipes;
