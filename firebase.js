// Firebase SDKs-এর লিঙ্কগুলো সরাসরি ব্যবহার করা হয়েছে
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js"; // নতুন যোগ করা হয়েছে

const firebaseConfig = {
  apiKey: "AIzaSyA5cBiWpmWm8pDYoTO3i85zy7_J3XntkPY",
  authDomain: "reward-earning-d8165.firebaseapp.com",
  projectId: "reward-earning-d8165",
  storageBucket: "reward-earning-d8165.firebasestorage.app",
  messagingSenderId: "175054692652",
  appId: "1:175054692652:web:b26cc70cb0cc1aeb8e0c89",
  measurementId: "G-1LH3C41ZN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// সার্ভিসগুলো এক্সপোর্ট করা হচ্ছে যাতে প্রোফাইল পেজে ব্যবহার করা যায়
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ইমেজ স্টোর করার জন্য এটি জরুরি
