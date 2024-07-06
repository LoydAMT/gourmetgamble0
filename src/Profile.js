import React, { useState, useEffect } from 'react';
import { auth, db, getUserProfile, uploadProfilePicture } from './firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Profile.css';

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setCurrentUser({
            uid: user.uid,
            name: userProfile.name || user.email,
            email: user.email,
            profilePicture: userProfile.profilePicture || '',
          });
          setProfilePicture(userProfile.profilePicture || '');
          
          // Fetch user recipes
          const recipeQuery = query(collection(db, 'recipes'), where('userId', '==', user.uid));
          const recipeQuerySnapshot = await getDocs(recipeQuery);
          const userRecipes = recipeQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecipes(userRecipes);
          
          // Fetch user favorites
          if (userProfile.favorites) {
            const favoriteRecipes = [];
            for (const favoriteId of userProfile.favorites) {
              const favoriteDoc = await getDoc(doc(db, 'recipes', favoriteId));
              if (favoriteDoc.exists()) {
                favoriteRecipes.push({ id: favoriteDoc.id, ...favoriteDoc.data() });
              }
            }
            setFavorites(favoriteRecipes);
          }
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      authUnsubscribe();
    };
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSaveProfilePicture = async () => {
    if (newProfilePicture && currentUser) {
      const file = document.querySelector('input[type="file"]').files[0];
      try {
        const url = await uploadProfilePicture(file, currentUser.uid);
        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, { profilePicture: url });
          setProfilePicture(url);
          setCurrentUser((prev) => ({ ...prev, profilePicture: url }));
          setNewProfilePicture(null);
          setError('');
        } else {
          setError('User document does not exist. Please ensure your user profile is set up correctly.');
        }
      } catch (error) {
        setError('Error uploading profile picture. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="profile-container">
      {currentUser ? (
        <>
          <h1>{currentUser.name}'s Profile</h1>
          <div className="profile-info">
            <img
              src={newProfilePicture || profilePicture || 'default-profile.png'}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-upload">
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
              {newProfilePicture && (
                <button onClick={handleSaveProfilePicture} className="save-button">Save</button>
              )}
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleLogout} className="logout-button">Logout</button>
          
          <h2>Your Recipes</h2>
          <div className="recipes-container">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          <h2>Your Favorites</h2>
          <div className="recipes-container">
            {favorites.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          {selectedRecipe && (
            <div className="modalBackground">
              <div className="modalContainer">
                <h2>{selectedRecipe.nameOfDish}</h2>
                <p><strong>Description:</strong> {selectedRecipe.description}</p>
                <p><strong>Origin:</strong> {selectedRecipe.origin}</p>
                <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(', ')}</p>
                <p><strong>Steps:</strong></p>
                <ul>
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <button onClick={handleCloseModal} className="button closeModalButton">Close</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default Profile;
