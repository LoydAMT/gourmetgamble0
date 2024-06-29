import React from 'react';

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
  const similarDishes = [
    { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e43d8858ed54ee72a143732334694a524229bed8dae953e7e900060c846f2e15?apiKey=58b165f68bc74f159c175e4d9cf0f581&", title: "SIMILAR DISH 1" },
    { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e43d8858ed54ee72a143732334694a524229bed8dae953e7e900060c846f2e15?apiKey=58b165f68bc74f159c175e4d9cf0f581&", title: "SIMILAR DISH 2" },
    { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e43d8858ed54ee72a143732334694a524229bed8dae953e7e900060c846f2e15?apiKey=58b165f68bc74f159c175e4d9cf0f581&", title: "SIMILAR DISH 3" },
    { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e43d8858ed54ee72a143732334694a524229bed8dae953e7e900060c846f2e15?apiKey=58b165f68bc74f159c175e4d9cf0f581&", title: "SIMILAR DISH 4" },
  ];

  return (
    <main className="dish-details">
      <section className="content-wrapper">
        <div className="dish-image-container">
          <div className="dish-image-wrapper">
            <img src={recipe.photo || "https://cdn.builder.io/api/v1/image/assets/TEMP/127b33c7ba18abb8d4427281ea2c8bbf1bf09faa1ec7b220e00de7f8bd4ef22b?apiKey=58b165f68bc74f159c175e4d9cf0f581&"} alt="Dish" className="icon" />
            <div className="main-image-container">
              <div className="main-image-wrapper">
                <img src={recipe.photo || "https://cdn.builder.io/api/v1/image/assets/TEMP/7c51fdb6d3b23b04b3e30c857b45962c4f982aa64375de0e23178dd9f52385af?apiKey=58b165f68bc74f159c175e4d9cf0f581&"} alt="Main dish" className="main-dish-image" />
                DISH PHOTO 1
              </div>
            </div>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/50bb264c8adee88dfca34106e9077eea9e1b8ac77b9f9fa1f2ed1a3ff661d1d4?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="" className="icon" />
          </div>
        </div>
        <div className="dish-info">
          <button className="close-button" onClick={() => window.history.back()}>×</button>
          <h1 className="dish-name">{recipe.nameOfDish}</h1>
          <p className="dish-author">BY {recipe.nameOfUser}</p>
          <div className="action-buttons">
            <button className="recipe-button">OPEN RECIPE BUTTON</button>
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
            <SimilarDishCard key={index} imageSrc={dish.imageSrc} title={dish.title} />
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
        .dish-image-wrapper {
          display: flex;
          margin-top: 107px;
          flex-grow: 1;
          align-items: center;
          gap: 7px;
          font-size: 64px;
          color: #000;
          font-weight: 700;
          text-align: center;
          line-height: 150%;
        }
        @media (max-width: 991px) {
          .dish-image-wrapper {
            margin-top: 40px;
            flex-wrap: wrap;
            font-size: 40px;
          }
        }
        .icon {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 45px;
          background-color: #d9d9d9;
          border-radius: 50%;
          align-self: stretch;
          height: 45px;
          margin: auto 0;
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
