import {initializeApp, getApps} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD6ooLBKAvjtbuw6cDWsb97K4t3PF-pJLk",
  authDomain: "campuscraves-e9df9.firebaseapp.com",
  projectId: "campuscraves-e9df9",
  storageBucket: "campuscraves-e9df9.firebasestorage.app",
  messagingSenderId: "386695738802",
  appId: "1:386695738802:web:6bade030ca49525fe9a0ab",
  measurementId: "G-6JG4P98RMK"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
