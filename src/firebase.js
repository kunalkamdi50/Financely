// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDczOYin_YvrnWFEC7MjJFr4W0lJePY7lQ",
  authDomain: "financely-38d56.firebaseapp.com",
  projectId: "financely-38d56",
  storageBucket: "financely-38d56.appspot.com",
  messagingSenderId: "869768990459",
  appId: "1:869768990459:web:5e2f41ae569a05c6732a5e",
  measurementId: "G-6FHYENRQ9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };