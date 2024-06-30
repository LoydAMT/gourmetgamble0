import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const RecipeSlideshow = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div style={styles.slideshowContainer}>
      <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
        {recipes.map((recipe, index) => (
          <div key={index}>
            <img
              src={recipe.photo || `https://via.placeholder.com/250?text=${recipe.nameOfDish}`}
              alt={recipe.nameOfDish}
              style={styles.filteredRecipePhoto}
            />
            <p className="legend">{recipe.nameOfDish}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const styles = {
  slideshowContainer: {
    width: '100%', // Adjust as needed
    maxWidth: '2000px', // Set a maximum width
    margin: '0 auto', // Center align horizontally
  },
  filteredRecipePhoto: {
    width: '100%',
    height: '643px',
    borderRadius: '15px',
  },

};

export default RecipeSlideshow;
