import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVtGJ7oMEf0TbTmoZTB_G1Hg9GX_PshWA",
    authDomain: "gourmetgamble-1.firebaseapp.com",
    projectId: "gourmetgamble-1",
    storageBucket: "gourmetgamble-1.appspot.com",
    messagingSenderId: "573275647223",
    appId: "1:573275647223:web:117be7110a1ffe3e4d37f2",
    measurementId: "G-Y43QVYFP9J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const getUserProfile = async (uid) => {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length ? querySnapshot.docs[0].data() : null;
};

const uploadProfilePicture = async (file, uid) => {
  const fileRef = ref(storage, `profilePictures/${uid}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export { db, auth, registerUser, loginUser, signInWithGoogle, getUserProfile, uploadProfilePicture };