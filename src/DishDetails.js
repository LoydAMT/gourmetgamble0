import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import ReactPlayer from 'react-player';
import './DishDetails.css';
import RecipeModal from './RecipeModal';

const SimilarDishCard = ({ imageSrc, title, onClick }) => (
  <div className="similar-dish-card" onClick={onClick}>
    <div className="image-wrapper">
      <img src={imageSrc} alt={title} className="dish-image" />
      {title}
    </div>
  </div>
);

const SocialButton = ({ src, alt }) => (
  <img src={src} alt={alt} className="social-icon" />
);

function extractYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
}

const DishDetails = ({ closeModal, recipe, onSimilarDishClick }) => {
  const [similarDishes, setSimilarDishes] = useState([]);
  const [mainDisplay, setMainDisplay] = useState('photo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const dishDetailsRef = useRef(null);

  useEffect(() => {
    if (dishDetailsRef.current) {
      dishDetailsRef.current.classList.add('fade-in');
      dishDetailsRef.current.classList.remove('fade-out');
    }

    const fetchSimilarDishes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter recipes with 5 or more shared ingredients
      const similar = recipesData.filter(r => {
        const sharedIngredients = r.ingredients.filter(ingredient => recipe.ingredients.includes(ingredient));
        return sharedIngredients.length >= 5;
      });

      // Exclude recipes with the same name as the current recipe
      const filteredSimilar = similar.filter(r => r.nameOfDish !== recipe.nameOfDish);
      setSimilarDishes(filteredSimilar);
    };

    if (recipe) {
      fetchSimilarDishes();
    }

    return () => {
      if (dishDetailsRef.current) {
        dishDetailsRef.current.classList.remove('fade-in');
        dishDetailsRef.current.classList.add('fade-out');
      }
    };
  }, [recipe]);

  const handleSimilarDishClick = (id) => {
    if (dishDetailsRef.current) {
      dishDetailsRef.current.classList.add('fade-out');
      dishDetailsRef.current.classList.remove('fade-in');
    }

    setTimeout(() => {
      onSimilarDishClick(id);
    }, 200); // Adjust the timeout to match the CSS animation duration
  };

  const handleDisplayChange = (displayType) => {
    setMainDisplay(displayType);
    setIsPlaying(displayType === 'video');
  };

  const videoID = recipe.video ? extractYouTubeID(recipe.video) : null;
  const videoThumbnailURL = videoID ? `https://img.youtube.com/vi/${videoID}/0.jpg` : "https://via.placeholder.com/150";

  return (
    <main className="dish-details fade-in" ref={dishDetailsRef}>
      <RecipeModal showModal={showRecipeModal} setShowModal={setShowRecipeModal} recipe={recipe} />
      <section className="content-wrapper">
        <div className="dish-image-container">
          <div className="main-image-container">
            <div className="main-image-wrapper">
              {mainDisplay === 'photo' && (
                <img src={recipe.photo || "https://via.placeholder.com/150"} alt="Main dish" className="main-dish-image" />
              )}
              {mainDisplay === 'video' && recipe.video && (
                <ReactPlayer url={recipe.video} playing={isPlaying} controls width="100%" />
              )}
            </div>
          </div>
          <div className="thumbnail-container">
            <div className="thumbnail" onClick={() => handleDisplayChange('photo')}>
              <img src={recipe.photo || "https://via.placeholder.com/150"} alt="Dish thumbnail" className="thumbnail-image" />
            </div>
            {recipe.video && (
              <div className="thumbnail" onClick={() => handleDisplayChange('video')}>
                <img src={videoThumbnailURL} alt="Video thumbnail" className="thumbnail-image" />
              </div>
            )}
          </div>
        </div>
        <div className="dish-info">
          <button className="close-button" onClick={closeModal}>×</button>
          <h1 className="dish-name">{recipe.nameOfDish}</h1>
          <p className="dish-author">Author:<br /> {recipe.nameOfUser}</p>
          <div className="action-buttons">
            <button className="recipe-button" onClick={() => setShowRecipeModal(true)}>OPEN RECIPE</button>
            <div className="social-buttons">
              <SocialButton src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a9066052bd6b7055bb6a1d42d410f27c58bf20b47d0c4ca3691f14d8f400d90?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Social media icon 1" />
              <SocialButton src="https://cdn.builder.io/api/v1/image/assets/TEMP/06ab42ee6002883ffd32c9c2e019c6e852d9bac72702bfb5a99342e9cc36ff2c?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Social media icon 2" />
            </div>
          </div>
          <h2 className="description-title">DESCRIPTION</h2>
          <p className="dish-description">{recipe.description}</p>
        </div>
      </section>
      <section className="similar-dishes">
        <h2 className="similar-dishes-title">SIMILAR DISHES</h2>
        <div className="similar-dishes-grid">
          {similarDishes.map((dish, index) => (
            <SimilarDishCard 
              key={index} 
              imageSrc={dish.photo || 'https://via.placeholder.com/150'} 
              title={dish.nameOfDish} 
              onClick={() => handleSimilarDishClick(dish.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DishDetails;
