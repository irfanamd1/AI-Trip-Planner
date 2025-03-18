import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyBI-3vROt4ffJWSKsYNNdSvbWXKZP8A7_k",
  authDomain: "ai-trip-plannerz.firebaseapp.com",
  projectId: "ai-trip-plannerz",
  storageBucket: "ai-trip-plannerz.firebasestorage.app",
  messagingSenderId: "726172049974",
  appId: "1:726172049974:web:f685ab1ad5bef1807e2e97"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);