import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Initialize Analytics safely
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics could not be initialized:", e);
    }
  }
}).catch(err => {
  console.warn("Firebase Analytics is not supported in this environment:", err);
});

const auth = getAuth(app);
const db = getFirestore(app);

// Export the instances for use in other modules
export { app, analytics, auth, db };
