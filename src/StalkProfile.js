import React, { useState, useEffect } from 'react';
import { db, getUserProfile } from './firebaseConfig';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import './Profile.css';

function StalkProfile() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async (uid) => {
      try {
        const userProfile = await getUserProfile(uid);
        if (userProfile) {
          setProfileUser({
            uid: uid,
            name: userProfile.name || '',
            email: userProfile.email || '',
            profilePicture: userProfile.profilePicture || '',
          });

          // Fetch user recipes
          const recipeQuery = query(collection(db, 'recipes'), where('userId', '==', uid));
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

          // Fetch following users
          if (userProfile.following && userProfile.following.length > 0) {
            const followingQuery = query(collection(db, 'users'), where('uid', 'in', userProfile.following));
            const followingSnapshot = await getDocs(followingQuery);
            const followingUsers = followingSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            setFollowing(followingUsers);
          } else {
            setFollowing([]);
          }

          // Fetch followers
          const followersQuery = query(collection(db, 'users'), where('following', 'array-contains', uid));
          const followersSnapshot = await getDocs(followersQuery);
          const userFollowers = followersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
          setFollowers(userFollowers);
        } else {
          setError('User profile not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again later.');
      }
    };

    if (userId) {
      fetchProfileData(userId);
    }
  }, [userId]);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="profile-container">
      {error && <div className="error-bar">{error}</div>}
      {profileUser ? (
        <>
          <h1>{profileUser.name}'s Profile</h1>
          <div className="profile-info">
            <img
              src={profileUser.profilePicture || 'default-profile.png'}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div>
            <button onClick={() => setShowFollowing(!showFollowing)} className="show-button">
              {showFollowing ? 'Hide Following' : 'Show Following'}
            </button>
            <button onClick={() => setShowFollowers(!showFollowers)} className="show-button">
              {showFollowers ? 'Hide Followers' : 'Show Followers'}
            </button>
          </div>

          <h2>{profileUser.name}'s Recipes</h2>
          <div className="recipes-container">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          <h2>{profileUser.name}'s Favorites</h2>
          <div className="recipes-container">
            {favorites.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          {showFollowing && (
            <>
              <h2>Following ({following.length})</h2>
              {following.length > 0 ? (
                <div className="recipes-container">
                  {following.map(user => (
                    <div key={user.uid} className="recipe-card">
                      <Link to={`/profile/${user.uid}`}>
                        <img src={user.profilePicture || 'default-profile.png'} alt="Profile" className="profile-picture" />
                        <p>{user.name}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{profileUser.name} is not following anyone yet.</p>
              )}
            </>
          )}

          {showFollowers && (
            <>
              <h2>Followers ({followers.length})</h2>
              {followers.length > 0 ? (
                <div className="recipes-container">
                  {followers.map(user => (
                    <div key={user.uid} className="recipe-card">
                      <Link to={`/profile/${user.uid}`}>
                        <img src={user.profilePicture || 'default-profile.png'} alt="Profile" className="profile-picture" />
                        <p>{user.name}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{profileUser.name} has no followers yet.</p>
              )}
            </>
          )}

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
        <p>Loading user profile...</p>
      )}
    </div>
  );
}

export default StalkProfile;
