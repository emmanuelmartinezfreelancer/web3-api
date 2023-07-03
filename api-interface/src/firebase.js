// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

require("dotenv").config();

const firebaseConfig = {
  apiKey: "AIzaSyBKcxGr9zzRWDqjEt6yRgys4nBv0gEFN4g",
  authDomain: "esat-alpha-26c1b.firebaseapp.com",
  projectId: "esat-alpha-26c1b",
  storageBucket: "esat-alpha-26c1b.appspot.com",
  messagingSenderId: "8313852575",
  appId: "1:8313852575:web:8c2ec047893b5541dec8aa"
};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);
