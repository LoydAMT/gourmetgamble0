import React from 'react';
import './DishCard.css';

const DishCard = () => {
    return (
        <div className="dish-card">
            <div className="dish-photo">DISH PHOTO 1</div>
            <div className="dish-info">
                <h1>DISH NAME</h1>
                <p>BY ____________</p>
                <button>OPEN RECIPE BUTTON</button>
                <div className="actions">
                    <button>★</button>
                    <button>🔖</button>
                </div>
                <p className="description">Description from the internet of the dish</p>
            </div>
        </div>
    );
};

export default DishCard;
