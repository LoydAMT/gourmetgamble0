import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth, getUserProfile } from './firebaseConfig';
import ReactPlayer from 'react-player';
import './DishDetails.css';
import RecipeModal from './RecipeModal';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState('');
  const [review, setReview] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const dishDetailsRef = useRef(null);
  const navigate = useNavigate();

  const handleUserClick = (uid) => {
    navigate(`/profile/${uid}`);
  };

  // Memoized fetchSimilarDishes function to prevent unnecessary re-renders
  const fetchSimilarDishes = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const similar = recipesData.filter(r => {
        const sharedIngredients = r.ingredients.filter(ingredient => recipe.ingredients.includes(ingredient));
        return sharedIngredients.length >= 5;
      });

      const filteredSimilar = similar.filter(r => r.nameOfDish !== recipe.nameOfDish);
      setSimilarDishes(filteredSimilar);
    } catch (error) {
      console.error('Error fetching similar dishes:', error);
      setError('Error fetching similar dishes. Please try again later.');
    }
  }, [recipe]);

  // Memoized fetchAverageRating function to prevent unnecessary re-renders
  const fetchAverageRating = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      let totalRatings = 0;
      let totalScore = 0;
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.reviews) {
          user.reviews.forEach((review) => {
            if (review.recipeId === recipe.id) {
              totalRatings++;
              totalScore += review.rating;
            }
          });
        }
      });

      if (totalRatings > 0) {
        setAverageRating(totalScore / totalRatings);
        setTotalRatings(totalRatings);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setError('Error fetching average rating. Please try again later.');
    }
  }, [recipe]);

  useEffect(() => {
    if (dishDetailsRef.current) {
      dishDetailsRef.current.classList.add('fade-in');
      dishDetailsRef.current.classList.remove('fade-out');
    }

    if (recipe) {
      fetchSimilarDishes();
      fetchAverageRating();
    }

    return () => {
      if (dishDetailsRef.current) {
        dishDetailsRef.current.classList.remove('fade-in');
        dishDetailsRef.current.classList.add('fade-out');
      }
    };
  }, [recipe, fetchSimilarDishes, fetchAverageRating]);

  const handleSimilarDishClick = (id) => {
    if (dishDetailsRef.current) {
      dishDetailsRef.current.classList.add('fade-out');
      dishDetailsRef.current.classList.remove('fade-in');
    }

    setTimeout(() => {
      onSimilarDishClick(id);
    }, 200);
  };

  const handleDisplayChange = (displayType) => {
    setMainDisplay(displayType);
    setIsPlaying(displayType === 'video');
  };

  const handleAddToFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You need to be logged in to add to favorites.');
        return;
      }

      const userProfileQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userProfileQuery);

      if (querySnapshot.empty) {
        setError('User profile not found.');
        return;
      }

      const userProfileDoc = querySnapshot.docs[0];
      const userProfile = userProfileDoc.data();
      const userRef = doc(db, 'users', userProfileDoc.id);

      const existingFavorites = userProfile.favorites || [];
      if (!existingFavorites.includes(recipe.id)) {
        await updateDoc(userRef, {
          favorites: [...existingFavorites, recipe.id]
        });
      } else {
        setError('This recipe is already in your favorites.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Error adding to favorites. Please try again later.');
    }
  };

  const handleAddReview = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You need to be logged in to give a review.');
        return;
      }

      const userProfileQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userProfileQuery);

      if (querySnapshot.empty) {
        setError('User profile not found.');
        return;
      }

      const userProfileDoc = querySnapshot.docs[0];
      const userProfile = userProfileDoc.data();
      const userRef = doc(db, 'users', userProfileDoc.id);

      const existingReviews = userProfile.reviews || [];
      const reviewIndex = existingReviews.findIndex(review => review.recipeId === recipe.id);

      if (reviewIndex !== -1) {
        existingReviews[reviewIndex].rating = review;
      } else {
        existingReviews.push({ recipeId: recipe.id, rating: review });
      }

      await updateDoc(userRef, {
        reviews: existingReviews
      });

      setHasReviewed(true);
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Error adding review. Please try again later.');
    }
  };

  const videoID = recipe.video ? extractYouTubeID(recipe.video) : null;
  const videoThumbnailURL = videoID ? `https://img.youtube.com/vi/${videoID}/0.jpg` : "https://via.placeholder.com/150";

  return (
    <main className="dish-details fade-in" ref={dishDetailsRef}>
      {error && <div className="error-bar">{error}</div>}
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
          <p className="dish-author" onClick={() => handleUserClick(recipe.userId)}>Author:<br /> {recipe.nameOfUser}</p>
          <div className="action-buttons">
            <button className="recipe-button" onClick={() => setShowRecipeModal(true)}>OPEN RECIPE</button>
            <button className="favorite-button" onClick={handleAddToFavorites}>ADD TO FAVORITES</button>
            <div className="review-section">
              <div className="review-buttons">
                <input type="radio" id="star5" name="rating" value="5" onClick={() => setReview(5)} />
                <label htmlFor="star5">★</label>
                <input type="radio" id="star4" name="rating" value="4" onClick={() => setReview(4)} />
                <label htmlFor="star4">★</label>
                <input type="radio" id="star3" name="rating" value="3" onClick={() => setReview(3)} />
                <label htmlFor="star3">★</label>
                <input type="radio" id="star2" name="rating" value="2" onClick={() => setReview(2)} />
                <label htmlFor="star2">★</label>
                <input type="radio" id="star1" name="rating" value="1" onClick={() => setReview(1)} />
                <label htmlFor="star1">★</label>
              </div>
              <button className="save-review-button" onClick={handleAddReview}>SAVE REVIEW</button>
            </div>
          </div>
          <h2 className="description-title">DESCRIPTION</h2>
          <p className="dish-description">{recipe.description}</p>
          <h2 className="average-rating">Average Rating: {averageRating.toFixed(1)} ({totalRatings} ratings)</h2>
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
