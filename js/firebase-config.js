// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbdZnzmeBIfFCwtIInIGRr1iQ1ZfrWA8s",
  authDomain: "operationschedular.firebaseapp.com",
  projectId: "operationschedular",
  storageBucket: "operationschedular.firebasestorage.app",
  messagingSenderId: "464819524799",
  appId: "1:464819524799:web:1b9d6406c59905d3af220a",
  measurementId: "G-CRCS0TDSS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the instances for use in other modules
export { app, analytics, auth, db };
