import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { auth, db, getUserProfile, uploadProfilePicture } from './firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddRecipeModal from './AddRecipeModal';
import DishDetails from './DishDetails';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            nickname: userProfile.nickname || '',
          });
          setProfilePicture(userProfile.profilePicture || '');

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
    } else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          fetchProfileData(user.uid);
        } else {
          setCurrentUser(null);
        }
      });
    }
  }, [userId]);

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
          setProfileUser((prev) => ({ ...prev, profilePicture: url }));
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

  const handleNicknameChange = async (e) => {
    if (currentUser) {
      const newNickname = e.target.value;
      try {
        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, { nickname: newNickname });
          setProfileUser((prev) => ({ ...prev, nickname: newNickname }));
          setError('');
        } else {
          setError('User document does not exist. Please ensure your user profile is set up correctly.');
        }
      } catch (error) {
        setError('Error updating nickname. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSimilarDishClick = (id) => {
    const selected = recipes.find(recipe => recipe.id === id);
    if (selected) {
      setSelectedRecipe(selected);
    }
  };

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
        let updatedFollowing;
        if (following.some(followingUser => followingUser.uid === followedUserId)) {
          updatedFollowing = userData.following.filter(id => id !== followedUserId);
        } else {
          updatedFollowing = [...userData.following, followedUserId];
        }

        await updateDoc(doc(db, 'users', userDoc.id), { following: updatedFollowing });

        // Update the local following state
        const updatedFollowingUsers = following.map(user => {
          if (user.uid === followedUserId) {
            return { ...user, isFollowing: !user.isFollowing };
          }
          return user;
        });
        setFollowing(updatedFollowingUsers);

        // Update the local followers state
        const updatedFollowers = followers.map(user => {
          if (user.uid === followedUserId) {
            return { ...user, isFollowing: !user.isFollowing };
          }
          return user;
        });
        setFollowers(updatedFollowers);

        console.log('Follow action successful:', followedUserId);
      } else {
        setError('User profile not found.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      setError('Error following user. Please try again later.');
    }
  };

  return (
    <div className="profile-container">
      {error && <div className="error-bar">{error}</div>}
      {profileUser ? (
        <>
          <div className="profile-header">
            <img
              src={profilePicture || 'default-profile.png'}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-details">
              <div className="nickname">{profileUser.nickname || 'Nickname'}</div>
              <div className="name">{profileUser.name}</div>
              <div className="profile-stats">
                <span>{recipes.length} Uploads</span>
                <span onClick={() => setShowFollowers(!showFollowers)}>{followers.length} Followers</span>
                <span onClick={() => setShowFollowing(!showFollowing)}>{following.length} Following</span>
              </div>
              {!userId && (
                <div className="profile-actions">
                  <button className="edit-profile-button" onClick={() => setShowEditProfileModal(true)}>Edit Profile</button>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              )}
            </div>
          </div>

          <div className="upload-recipe-button-container">
            <button className="upload-recipe-button" onClick={() => setShowAddRecipeModal(true)}>Upload Recipe</button>
          </div>

          <h2>Saved Recipes</h2>
          <div className="recipes-container-profile">
            {favorites.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => openModal(recipe)}>
                <img src={recipe.photo} alt={recipe.nameOfDish} className="recipe-photo" />
                <p>{recipe.nameOfDish}</p>
              </div>
            ))}
          </div>

          <h2>My Recipes</h2>
          <div className="recipes-container-profile">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => openModal(recipe)}>
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
                      {!userId && (
                        <button className="follow-button" onClick={() => handleFollow(user.uid)}>
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>You are not following anyone yet.</p>
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
                      {!userId && (
                        <button className="follow-button" onClick={() => handleFollow(user.uid)}>
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>You don't have any followers yet.</p>
              )}
            </>
          )}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
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
            {selectedRecipe && <DishDetails recipe={selectedRecipe} onSimilarDishClick={handleSimilarDishClick} />}
          </Modal>

          <AddRecipeModal showModal={showAddRecipeModal} setShowModal={setShowAddRecipeModal} />
          <EditProfileModal
            showModal={showEditProfileModal}
            setShowModal={setShowEditProfileModal}
            profilePicture={profilePicture}
            newProfilePicture={newProfilePicture}
            handleProfilePictureChange={handleProfilePictureChange}
            handleSaveProfilePicture={handleSaveProfilePicture}
            handleNicknameChange={handleNicknameChange}
            profileUser={profileUser}
          />
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

function EditProfileModal({
  showModal,
  setShowModal,
  profilePicture,
  newProfilePicture,
  handleProfilePictureChange,
  handleSaveProfilePicture,
  handleNicknameChange,
  profileUser,
}) {
  if (!showModal) return null;

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <h2>Edit Profile</h2>
        <div className="profile-edit">
          <img
            src={newProfilePicture || profilePicture || 'default-profile.png'}
            alt="Profile"
            className="profile-picture-edit"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose File
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleProfilePictureChange} />
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            placeholder="Set Nickname"
            defaultValue={profileUser.nickname}
            onBlur={handleNicknameChange}
          />
          <div className="button-container">
            <button onClick={handleSaveProfilePicture} className="button save-button">Save</button>
            <button onClick={() => setShowModal(false)} className="button closeModalButton">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
