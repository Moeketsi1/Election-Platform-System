import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase config (already in firebase-config.js)
import { firebaseConfig } from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup function
window.signup = async function () {
    const name = document.getElementById("signup-name").value.trim();
    const surname = document.getElementById("signup-surname").value.trim();
    const cellphone = document.getElementById("signup-cellphone").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const province = document.getElementById("signup-province").value;
    const messageElement = document.getElementById("message");

    // Validate inputs
    if (!name || !surname || !cellphone || !email || !password || !province) {
        messageElement.textContent = "Please fill out all fields.";
        messageElement.style.color = "red";
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name,
            surname,
            cellphone,
            email,
            province,
            voted: false, // Default value for vote status
            createdAt: new Date().toISOString()
        });

        // Display success message
        messageElement.textContent = "Registration successful! Please verify your email.";
        messageElement.style.color = "green";

        // Optionally, redirect to login page
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 3000);
    } catch (error) {
        console.error("Error during registration:", error);

        // Display error message
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = "red";
    }
};

































