import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5cBiWpmWm8pDYoTO3i85zy7_J3XntkPY",
  authDomain: "reward-earning-d8165.firebaseapp.com",
  projectId: "reward-earning-d8165",
  storageBucket: "reward-earning-d8165.firebasestorage.app",
  messagingSenderId: "175054692652",
  appId: "1:175054692652:web:b26cc70cb0cc1aeb8e0c89",
  measurementId: "G-1LH3C41ZN3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
