import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6uBvwWieqIFYg35ZB_257HNHG2-fl1oI",
  authDomain: "pelentung.firebaseapp.com",
  projectId: "pelentung",
  storageBucket: "pelentung.firebasestorage.app",
  messagingSenderId: "1033413513485",
  appId: "1:1033413513485:web:8bb007b0b7a316ad4ee044",
  measurementId: "G-N9NK0464VK"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
