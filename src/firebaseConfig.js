// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVtGJ7oMEf0TbTmoZTB_G1Hg9GX_PshWA",
  authDomain: "gourmetgamble-1.firebaseapp.com",
  projectId: "gourmetgamble-1",
  storageBucket: "gourmetgamble-1.appspot.com",
  messagingSenderId: "573275647223",
  appId: "1:573275647223:webnpm :117be7110a1ffe3e4d37f2",
  measurementId: "G-Y43QVYFP9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };