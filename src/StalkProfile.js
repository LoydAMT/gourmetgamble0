import React, { useState, useEffect } from 'react';
import { db, getUserProfile } from './firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import './Profile.css';

function StalkProfile() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
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
            const followingUsers = followingSnapshot.docs.map(doc => ({
              uid: doc.id,
              ...doc.data(),
              isFollowing: true,
            }));
            setFollowing(followingUsers);
          } else {
            setFollowing([]);
          }

          // Fetch followers
          const followersQuery = query(collection(db, 'users'), where('following', 'array-contains', uid));
          const followersSnapshot = await getDocs(followersQuery);
          const userFollowers = followersSnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
            isFollowing: userProfile.following.includes(doc.id),
          }));
          setFollowers(userFollowers);

          // Check if current user is following this profile
          if (currentUser && userProfile.followers && userProfile.followers.includes(currentUser.uid)) {
            setIsFollowing(true);
          }
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

    // Fetch current user data
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.following && userData.following.includes(userId)) {
            setIsFollowing(true);
          }
        }
      }
    });
  }, [userId]);

  const handleFollow = async (followedUserId) => {
    if (!currentUser) {
      setError('You need to be logged in to follow users.');
      return;
    }

    try {
      const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.following.includes(followedUserId)) {
          setError('You are already following this user.');
        } else {
          const updatedFollowing = [...userData.following, followedUserId];
          await updateDoc(doc(db, 'users', userDoc.id), { following: updatedFollowing });

          // Update the local following state
          setFollowing(prevFollowing =>
            prevFollowing.map(user => {
              if (user.uid === followedUserId) {
                return { ...user, isFollowing: true };
              }
              return user;
            })
          );

          // Update the local followers state
          setFollowers(prevFollowers =>
            prevFollowers.map(user => {
              if (user.uid === followedUserId) {
                return { ...user, isFollowing: true };
              }
              return user;
            })
          );

          setIsFollowing(true);
          setError('');
        }
      } else {
        setError('User profile not found.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      setError('Error following user. Please try again later.');
    }
  };

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
          <div className="profile-header">
            <img
              src={profileUser.profilePicture || 'default-profile.png'}
              alt="Profile"
              className="profile-picture"
            />
            {currentUser && currentUser.uid !== userId && (
              <button onClick={() => handleFollow(userId)} className="follow-button">
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="profile-actions">
            <button onClick={() => setShowFollowing(!showFollowing)} className="follow-button">
              {showFollowing ? 'Hide Following' : 'Show Following'}
            </button>
            <button onClick={() => setShowFollowers(!showFollowers)} className="follow-button">
              {showFollowers ? 'Hide Followers' : 'Show Followers'}
            </button>
          </div>

          <h2>{profileUser.name}'s Recipes</h2>
          <div className="recipes-container-profile">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          <h2>{profileUser.name}'s Favorites</h2>
          <div className="recipes-container-profile">
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
                <div className="recipes-container-profile">
                  {following.map(user => (
                    <div key={user.uid} className="recipe-card">
                      <Link to={`/profile/${user.uid}`}>
                        <img src={user.profilePicture || 'default-profile.png'} alt="Profile" className="profile-picture" />
                        <p className="Username">{user.name}</p>
                      </Link>
                      {currentUser && (
                        <button className="follow-button" onClick={() => handleFollow(user.uid)}>
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
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
                <div className="recipes-container-profile">
                  {followers.map(user => (
                    <div key={user.uid} className="recipe-card">
                      <Link to={`/profile/${user.uid}`}>
                        <img src={user.profilePicture || 'default-profile.png'} alt="Profile" className="profile-picture" />
                        <p>{user.name}</p>
                      </Link>
                      {currentUser && (
                        <button className="follow-button" onClick={() => handleFollow(user.uid)}>
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
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
