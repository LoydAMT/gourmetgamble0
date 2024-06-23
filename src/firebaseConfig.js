// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

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

export { app, db }; // Export db along with other Firebase objects if needed
