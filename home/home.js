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

//-----------------modal funcations----------------
let showModal = (message) => {
  document.getElementById("modalMessage").innerText = message;
  document.getElementById("popupModal").style.display = "flex";
};

window.closeModal = () => {
  document.getElementById("popupModal").style.display = "none";
};
//-----------------modal funcations ends here above----------------

// Check if user data exists
if (userData) {
  console.log(userData);
  if (userData.section === undefined) {
    message.innerText = `Welcome !
    Name: ${userData.userName}
    Email: ${userData.email}
    `;
  } else {
    message.innerText = `Welcome !
    Name: ${userData.userName}
    Email: ${userData.email}
    Section: ${userData.section}
    Gender: ${userData.gender}
    `;
  }
} else {
  window.location.replace("../signIn/sigIn.html");
}

// Logout functionality
logOut.addEventListener("click", async () => {
  try {
    // Show spinner before starting the logout process

    // Perform logout
    await signOut(auth);

    // Remove user data from local storage
    localStorage.removeItem("userData");

    // Inform the user of successful logout
    showModal("You have been logged out successfully.");

    // Redirect to the sign-in page
    window.location.replace("../signIn/sigIn.html");
  } catch (error) {
    // Log the error to the console
    console.error("Error during sign-out:", error.message);

    // Notify the user of the issue
    showModal("An error occurred during logout. Please try again.");
  }
});
