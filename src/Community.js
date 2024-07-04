import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, getUserProfile, uploadPostPhoto } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './Community.css';

import defaultProfilePicture from './user.png';

function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostPhoto, setNewPostPhoto] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(sortPosts(postsData));
    });

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setCurrentUser({
            uid: user.uid,
            name: userProfile.name || user.email,
            profilePicture: userProfile.profilePicture || defaultProfilePicture,
          });
        } else {
          setCurrentUser({
            uid: user.uid,
            name: user.email,
            profilePicture: defaultProfilePicture,
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const sortPosts = (posts) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recentPosts = posts.filter(post => post.createdAt && new Date(post.createdAt) > twoDaysAgo);
    const olderPostsWithLikes = posts.filter(post => post.createdAt && new Date(post.createdAt) <= twoDaysAgo && post.likes && post.likes.length > 0);
    const olderPostsWithoutLikes = posts.filter(post => post.createdAt && new Date(post.createdAt) <= twoDaysAgo && (!post.likes || post.likes.length === 0));
    const postsWithoutTimestamps = posts.filter(post => !post.createdAt);

    recentPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    olderPostsWithLikes.sort((a, b) => b.likes.length - a.likes.length);

    return [...recentPosts, ...olderPostsWithLikes, ...olderPostsWithoutLikes, ...postsWithoutTimestamps];
  };

  const handlePostPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostPhoto(file);
    }
  };

  const handleAddPost = async () => {
    if (newPost.trim() && currentUser) {
      let photoURL = null;
      if (newPostPhoto) {
        photoURL = await uploadPostPhoto(newPostPhoto);
        setNewPostPhoto(null);
      }

      const newPostData = {
        content: newPost,
        comments: [],
        likes: [],
        userName: currentUser.name,
        userProfilePicture: currentUser.profilePicture,
        createdAt: new Date().toISOString(),
        photoURL,
        userId: currentUser.uid,
      };

      await addDoc(collection(db, 'posts'), newPostData);
      setNewPost('');
    }
  };

  const handleAddComment = async (postId, comment) => {
    if (comment.trim() && currentUser) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const newComment = {
          content: comment,
          userName: currentUser.name,
          userProfilePicture: currentUser.profilePicture,
          createdAt: new Date().toISOString(),
          userId: currentUser.uid,
        };
        await updateDoc(postRef, { comments: [...postData.comments, newComment] });
      } else {
        console.error('Post does not exist!');
      }
    }
  };

  const handleLike = async (postId) => {
    if (currentUser) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likes = postData.likes || [];
        if (likes.includes(currentUser.uid)) {
          await updateDoc(postRef, { likes: likes.filter(uid => uid !== currentUser.uid) });
        } else {
          await updateDoc(postRef, { likes: [...likes, currentUser.uid] });
        }
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddImageClick = () => {
    document.getElementById('post-photo-input').click();
  };

  const handleEditPost = async (postId, newContent) => {
    if (newContent) {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { content: newContent });
    }
  };

  const handleDeletePost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  };

  const handleEditComment = async (postId, commentIndex, newContent) => {
    if (newContent) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const comments = [...postData.comments];
        comments[commentIndex].content = newContent;
        await updateDoc(postRef, { comments });
      }
    }
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const comments = [...postData.comments];
      comments.splice(commentIndex, 1);
      await updateDoc(postRef, { comments });
    }
  };

  const getFilteredPosts = () => {
    const filteredPosts = posts.filter(post =>
      (post.userName && post.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (filter) {
      case 'myPosts':
        return filteredPosts.filter(post => post.userId === currentUser?.uid);
      case 'interactions':
        return filteredPosts.filter(post => post.likes?.includes(currentUser?.uid) || post.comments?.some(comment => comment.userId === currentUser?.uid));
      default:
        return filteredPosts;
    }
  };

  return (
    <div className="community-container">
      <div className="post-input-container">
        <img src={currentUser?.profilePicture || defaultProfilePicture} alt="Profile" className="profile-picture" />
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="new-post-input"
        />
        <button onClick={handleAddImageClick} className="add-image-button">
          <span role="img" aria-label="Add Image">📷</span>
        </button>
        <input id="post-photo-input" type="file" accept="image/*" onChange={handlePostPhotoChange} className="file-input" />
        <button onClick={handleAddPost} className="new-post-button">Post</button>
      </div>

      <div className="filter-buttons">
        <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-button ${filter === 'myPosts' ? 'active' : ''}`} onClick={() => setFilter('myPosts')}>My Posts</button>
        <button className={`filter-button ${filter === 'interactions' ? 'active' : ''}`} onClick={() => setFilter('interactions')}>Interactions</button>
      </div>

      <div className="main-content">
        <div className="posts-container">
          {getFilteredPosts().map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.userProfilePicture || defaultProfilePicture} alt="Profile" className="profile-picture" />
                <div>
                  <p className="post-user-name"><strong>{post.userName}</strong></p>
                  {post.createdAt && <p className="post-timestamp">{new Date(post.createdAt).toLocaleString()}</p>}
                </div>
                {post.userId === currentUser?.uid && (
                  <div className="post-options">
                    <button className="options-button">⋮</button>
                    <div className="options-menu">
                      <button onClick={() => handleEditPost(post.id, prompt('Edit post:', post.content))}>Edit</button>
                      <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
              <p>{post.content}</p>
              {post.photoURL && <img src={post.photoURL} alt="Post" className="post-photo" />}
              <div className="likes-comments-container">
                <button onClick={() => handleLike(post.id)} className="like-button">
                  {post.likes && post.likes.includes(currentUser?.uid) ? 'Unlike' : 'Like'}
                </button>
                <span>{post.likes ? post.likes.length : 0} Likes</span>
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment" title={new Date(comment.createdAt).toLocaleString()}>
                    <img src={comment.userProfilePicture || defaultProfilePicture} alt="Profile" className="profile-picture" />
                    <p><strong>{comment.userName}</strong>: {comment.content}</p>
                    {comment.userId === currentUser?.uid && (
                      <div className="comment-options">
                        <button className="options-button">⋮</button>
                        <div className="options-menu">
                          <button onClick={() => handleEditComment(post.id, index, prompt('Edit comment:', comment.content))}>Edit</button>
                          <button onClick={() => handleDeleteComment(post.id, index)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <AddComment postId={post.id} onAddComment={handleAddComment} />
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar">
          <div className="search-bar-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              className="search-bar"
            />
          </div>
          <div className="sidebar-section">
            <h3>Trends for you</h3>
            {/* Add your trends content here */}
          </div>
          <div className="sidebar-section">
            <h3>Who to follow</h3>
            {/* Add your follow suggestions here */}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddComment({ postId, onAddComment }) {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    onAddComment(postId, comment);
    setComment('');
  };

  return (
    <div className="add-comment-container">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="comment-input"
      />
      <button onClick={handleAddComment} className="comment-button">Add Comment</button>
    </div>
  );
}

export default Community;
