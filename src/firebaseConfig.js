// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication functions with error handling
const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export { app, db, auth, registerUser, loginUser };
