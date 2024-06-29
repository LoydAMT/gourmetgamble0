import React from 'react';
import './SimilarDish.css';

const SimilarDish = ({ name }) => {
    return (
        <div className="similar-dish">
            <div className="similar-dish-photo">{name}</div>
        </div>
    );
};

export default SimilarDish;
