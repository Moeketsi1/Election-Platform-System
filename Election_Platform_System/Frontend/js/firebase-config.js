import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArMcYsmynZj9ZTU-bVrS1Cd0sY-uTJ_q4",
  authDomain: "election-platform-2bd6e.firebaseapp.com",
  projectId: "election-platform-2bd6e",
  storageBucket: "election-platform-2bd6e.firebasestorage.app",
  messagingSenderId: "217515421593",
  appId: "1:217515421593:web:ccc375f261a9f1b3846d08"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };