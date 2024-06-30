import React, { useState } from 'react';

const styles = {
  filteredIngredientList: {
    listStyle: 'none',
    padding: 0,
  },
  showMoreButton: {
    backgroundColor: '#ffa62f',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#143501',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

const IngredientList = ({ ingredients }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <ul style={styles.filteredIngredientList}>
      {ingredients.slice(0, 3).map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
      {ingredients.length > 3 && (
        <>
          {showAll && ingredients.slice(3).map((ingredient, index) => (
            <li key={index + 3}>{ingredient}</li>
          ))}
          <button style={styles.showMoreButton} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </>
      )}
    </ul>
  );
};

export default IngredientList;
