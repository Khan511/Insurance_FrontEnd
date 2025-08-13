// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxpYEZBbhTv_EMabEjhXcq2e-ZZT9IDG8",
  authDomain: "insurance-4c177.firebaseapp.com",
  projectId: "insurance-4c177",
  storageBucket: "insurance-4c177.firebasestorage.app",
  messagingSenderId: "335568202474",
  appId: "1:335568202474:web:dd1ed1b5d54989ede94593",
  measurementId: "G-X1DZWG6JBQ",
  //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
