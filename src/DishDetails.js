import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import ReactPlayer from 'react-player';

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
  };

  return (
    <main className="dish-details">
      <section className="content-wrapper">
        <div className="dish-image-container">
          <div className="main-image-container">
            <div className="main-image-wrapper">
              {mainDisplay === 'photo' && (
                <img src={recipe.photo || "https://via.placeholder.com/150"} alt="Main dish" className="main-dish-image" />
              )}
              {mainDisplay === 'video' && recipe.video && (
                <ReactPlayer url={recipe.video} controls width="100%" />
              )}
            </div>
          </div>
          <div className="thumbnail-container">
            <div className="thumbnail" onClick={() => handleDisplayChange('photo')}>
              <img src={recipe.photo || "https://via.placeholder.com/150"} alt="Dish thumbnail" className="thumbnail-image" />
            </div>
            {recipe.video && (
              <div className="thumbnail" onClick={() => handleDisplayChange('video')}>
                <ReactPlayer url={recipe.video} light width="100%" height="100%" />
              </div>
            )}
          </div>
        </div>
        <div className="dish-info">
          <button className="close-button" onClick={() => window.history.back()}>×</button>
          <h1 className="dish-name">{recipe.nameOfDish}</h1>
          <p className="dish-author">BY {recipe.nameOfUser}</p>
          <div className="action-buttons">
            <button className="recipe-button" onClick={() => handleDisplayChange('video')}>OPEN RECIPE BUTTON</button>
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
      <style jsx>{`
        .dish-details {
          background-color: #fff;
          display: flex;
          flex-direction: column;
          padding: 43px 66px 80px 6px;
        }
        @media (max-width: 991px) {
          .dish-details {
            padding-right: 20px;
          }
        }
        .content-wrapper {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .content-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
          }
        }
        .dish-image-container {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 57%;
          margin-left: 0;
        }
        @media (max-width: 991px) {
          .dish-image-container {
            width: 100%;
          }
        }
        .main-image-container {
          border-radius: 20px;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
          border: 1px solid #000;
          background-color: #d9d9d9;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 22px 30px;
        }
        @media (max-width: 991px) {
          .main-image-container {
            max-width: 100%;
            font-size: 40px;
            padding: 0 20px;
          }
        }
        .main-image-wrapper {
          display: flex;
          flex-direction: column;
          font-family: Inter, sans-serif;
          position: relative;
          stroke-width: 1px;
          stroke: #000;
          overflow: hidden;
          border: 1px solid #000;
          min-height: 269px;
          justify-content: center;
          padding: 131px 9px 90px;
        }
        @media (max-width: 991px) {
          .main-image-wrapper {
            max-width: 100%;
            font-size: 40px;
            padding-top: 40px;
          }
        }
        .main-dish-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }
        .thumbnail-container {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .thumbnail {
          cursor: pointer;
          width: 80px;
          height: 80px;
          border: 1px solid #000;
          border-radius: 5px;
          overflow: hidden;
        }
        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dish-info {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 43%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .dish-info {
            width: 100%;
            margin-top: 33px;
          }
        }
        .close-button {
          justify-content: center;
          align-items: center;
          border-radius: 50px;
          filter: blur(1px);
          border: 1px solid #000;
          background-color: #d9d9d9;
          align-self: flex-end;
          width: 56px;
          color: #000;
          white-space: nowrap;
          height: 56px;
          padding: 0 12px;
          font: 500 48px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .close-button {
            font-size: 40px;
            white-space: initial;
          }
        }
        .dish-name {
          color: #000;
          text-align: center;
          margin-top: 51px;
          font: 700 64px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .dish-name {
            max-width: 100%;
            margin-top: 40px;
            font-size: 40px;
          }
        }
        .dish-author {
          color: #000;
          text-align: center;
          margin-top: 45px;
          font: 700 24px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .dish-author {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .action-buttons {
          display: flex;
          margin-top: 41px;
          gap: 19px;
        }
        @media (max-width: 991px) {
          .action-buttons {
            flex-wrap: wrap;
            margin-top: 40px;
          }
        }
        .recipe-button {
          border-radius: 10px;
          background-color: #d9d9d9;
          color: #000;
          text-align: center;
          justify-content: center;
          flex-grow: 1;
          padding: 15px 13px;
          font: 700 24px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .recipe-button {
            padding-right: 20px;
          }
        }
        .social-buttons {
          align-self: start;
          display: flex;
          gap: 7px;
        }
        .social-icon {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 46px;
          border-radius: 10px;
        }
        .description-title {
          color: #000;
          text-align: center;
          margin-top: 42px;
          font: 700 24px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .description-title {
            max-width: 100%;
            margin-top: 40px;
          }
        }
        .dish-description {
          color: #000;
          align-self: start;
          margin: 23px 0 0 33px;
          font: 700 15px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .dish-description {
            margin-left: 10px;
          }
        }
        .similar-dishes-title {
          color: #000;
          text-align: center;
          align-self: start;
          margin: 150px 0 0 30px;
          font: 700 24px/150% Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }
        @media (max-width: 991px) {
          .similar-dishes-title {
            margin: 40px 0 0 10px;
          }
        }
        .similar-dishes-grid {
          align-self: center;
          margin-top: 31px;
          width: 100%;
          max-width: 1045px;
          display: flex;
          gap: 20px;
        }
        @media (max-width: 991px) {
          .similar-dishes-grid {
            max-width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
          }
        }
        .similar-dish-card {
          border-radius: 20px;
          background-color: #d9d9d9;
          display: flex;
          flex-grow: 1;
          align-items: center;
          font-size: 24px;
          color: #000;
          font-weight: 700;
          text-align: center;
          line-height: 150%;
          justify-content: center;
          width: 100%;
          padding: 16px 13px;
        }
        @media (max-width: 991px) {
          .similar-dish-card {
            margin-top: 40px;
          }
        }
        .image-wrapper {
          display: flex;
          flex-direction: column;
          font-family: Inter, sans-serif;
          position: relative;
          stroke-width: 1px;
          stroke: #000;
          overflow: hidden;
          border: 1px solid #000;
          aspect-ratio: 1.53;
          justify-content: center;
          padding: 57px 13px;
        }
        .dish-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }
      `}</style>
    </main>
  );
}

export default DishDetails;
