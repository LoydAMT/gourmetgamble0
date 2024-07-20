import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db, getUserProfile } from './firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import DishDetails from './DishDetails';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            }));
            setFollowing(followingUsers);
          } else {
            setFollowing([]);
          }

          // Fetch followers
          fetchFollowers(uid);

        } else {
          setError('User profile not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again later.');
      }
    };

    const fetchFollowers = async (uid) => {
      try {
        const followersQuery = query(collection(db, 'users'), where('following', 'array-contains', uid));
        const followersSnapshot = await getDocs(followersQuery);
        const userFollowers = followersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setFollowers(userFollowers);
      } catch (error) {
        console.error('Error fetching followers:', error);
        setError('Error fetching followers. Please try again later.');
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
        // Retrieve the user document using the random ID and user ID
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
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
      // Retrieve the user document using the random ID and user ID
      const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        const userData = userDoc.data();
        let updatedFollowing;

        if (isFollowing) {
          updatedFollowing = userData.following.filter(id => id !== followedUserId);
          await updateDoc(userRef, { following: updatedFollowing });
          setIsFollowing(false);
        } else {
          updatedFollowing = [...userData.following, followedUserId];
          await updateDoc(userRef, { following: updatedFollowing });
          setIsFollowing(true);
        }

        setFollowing(updatedFollowing);

        setError('');
      } else {
        setError('Current user profile not found.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      setError(`Error following user: ${error.message}`);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
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
                      
                    </div>
                  ))}
                </div>
              ) : (
                <p>{profileUser.name} has no followers yet.</p>
              )}
            </>
          )}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Recipe Details"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90%',
                maxHeight: '90%',
                padding: '0px',
                borderRadius: '20px',
              },
            }}
          >
            {selectedRecipe && (
              <DishDetails
                recipe={selectedRecipe}
                closeModal={handleCloseModal}
              />
            )}
          </Modal>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
}

export default StalkProfile;
