import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCbAbrPee4gk_iopqD1r2o2idzE0D_vQ1w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kabarterbaru-ed022.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kabarterbaru-ed022",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kabarterbaru-ed022.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "518244751103",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:518244751103:web:761ce0f4f4a3009df9deca"
};

// Initialize Firebase safely
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
