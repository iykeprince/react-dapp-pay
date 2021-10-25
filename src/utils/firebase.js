
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: "AIzaSyA0bbcNQJtGbVk3bGNH8jDOFUUpMV5Uang",
  authDomain: "tidos-7ba90.firebaseapp.com",
  projectId: "tidos-7ba90",
  storageBucket: "tidos-7ba90.appspot.com",
  messagingSenderId: "207007765466",
  appId: "1:207007765466:web:e2ce1bfdfaec136c89e6e3",
})

// const analytics = getAnalytics(app);
export const db = getFirestore();

export default firebaseApp;