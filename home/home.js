import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfgK34boUe0T77KFpteYvMRCYJ-aXOjqc",
  authDomain: "verysimpleuserform.firebaseapp.com",
  projectId: "verysimpleuserform",
  storageBucket: "verysimpleuserform.firebasestorage.app",
  messagingSenderId: "712556880799",
  appId: "1:712556880799:web:c9ae8ce0632ae17b68d3aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
let message = document.querySelector("#message");
let logOut = document.querySelector("#logOut");

// Get local storage data
let userData = JSON.parse(localStorage.getItem("userData"));

// Check if user data exists
if (userData) {
  console.log(userData);
  message.innerText = `Name: ${userData.userName}
  Email: ${userData.email}
  `;
} else {
  window.location.replace("../signIn/sigIn.html");
}

// Logout functionality
logOut.addEventListener("click", async () => {
  try {
    await signOut(auth);
    // Sign-out successful
    localStorage.removeItem("userData");
    alert("You have been logged out successfully.");
    window.location.replace("../signIn/sigIn.html");
  } catch (error) {
    console.error("Error during sign-out:", error.message);
    alert("An error occurred during logout. Please try again.");
  }
});
