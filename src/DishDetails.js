import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import ReactPlayer from 'react-player';
import './DishDetails.css';
import RecipeModal from './RecipeModal';

const SimilarDishCard = ({ imageSrc, title }) => (
  <div className="similar-dish-card">
    <div className="image-wrapper">
      <img src={imageSrc} alt={title} className="dish-image" />
      {title}
    </div>
  </div>
);

const SocialButton = ({ src, alt }) => (
  <img src={src} alt={alt} className="social-icon" />
);

const DishDetails = ({ recipe }) => {
  const [similarDishes, setSimilarDishes] = useState([]);
  const [mainDisplay, setMainDisplay] = useState('photo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  useEffect(() => {
    const fetchSimilarDishes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const similar = recipesData.filter(r => {
        const sharedIngredients = r.ingredients.filter(ingredient => recipe.ingredients.includes(ingredient));
        return sharedIngredients.length >= 5;
      });

      setSimilarDishes(similar);
    };

    if (recipe) {
      fetchSimilarDishes();
    }
  }, [recipe]);

  const handleDisplayChange = (displayType) => {
    setMainDisplay(displayType);
    setIsPlaying(displayType === 'video');
  };

  return (
    <main className="dish-details">
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
                <img src="https://tse1.mm.bing.net/th?id=OIP.dzugAXMlgEoZcJgtR2Er_gHaHa&pid=Api&P=0&h=180" alt="Video thumbnail" className="thumbnail-image" />
              </div>
            )}
          </div>
        </div>
        <div className="dish-info">
          <button className="close-button" onClick={() => window.location.reload()}>×</button>
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
            <SimilarDishCard key={index} imageSrc={dish.photo || 'https://via.placeholder.com/150'} title={dish.nameOfDish} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DishDetails;
