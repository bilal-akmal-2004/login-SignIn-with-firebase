import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfgK34boUe0T77KFpteYvMRCYJ-aXOjqc",
  authDomain: "verysimpleuserform.firebaseapp.com",
  projectId: "verysimpleuserform",
  storageBucket: "verysimpleuserform.firebasestorage.app",
  messagingSenderId: "712556880799",
  appId: "1:712556880799:web:c9ae8ce0632ae17b68d3aa",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

let emailInp = document.querySelector("#emailInp");
let passwordInp = document.querySelector("#passwordInp");
let fnameInp = document.querySelector("#fnameInp");
let lnameInp = document.querySelector("#lnameInp");
let mainForm = document.querySelector("#mainForm");

let registerData = async (event) => {
  event.preventDefault();

  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      emailInp.value,
      passwordInp.value
    );
    const firebaseUser = credentials.user;
    const { uid } = firebaseUser;

    await set(ref(db, "Users/" + uid), {
      id: uid,
      firstName: fnameInp.value,
      lastName: lnameInp.value,
      email: emailInp.value,
    });

    console.log("Data written successfully!");
    alert("Data stored successfully.");

    // Optional: Local storage and redirection
    if (!localStorage.getItem("userData")) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          email: emailInp.value,
          userName: `${fnameInp.value} ${lnameInp.value}`,
        })
      );
    }
    window.location.replace("./home/home.html");
  } catch (error) {
    if (error.code === `auth/email-already-in-use`) {
      alert("Email already exists.");
    } else if (error.code === `auth/weak-password`) {
      alert("Password should be at least 6 characters long.");
    }
    console.error("Error:", error.code, error.message);
  }
};

mainForm.addEventListener("submit", registerData);
const provider = new GoogleAuthProvider();

document.getElementById("google-login").addEventListener("click", async () => {
  try {
    // Perform Google Sign-In
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Extract token and user info
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // Log the user details to the console
    console.log("User Info:", user);
    console.log("Token:", token);

    // Check if the user already exists in the database (optional)
    const userRef = ref(db, "Users/" + user.uid);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      // If user doesn't exist in the database, create the user
      await set(userRef, {
        id: user.uid,
        firstName: user.displayName,
        email: user.email,
      });
      console.log("User data stored successfully.");
    } else {
      console.log("User already exists in the database.");
    }

    // Store user data in localStorage for future use
    if (!localStorage.getItem("userData")) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          email: user.email,
          userName: user.displayName,
        })
      );
    }

    // Redirect user to the home page
    window.location.replace("./home/home.html");
  } catch (error) {
    // Handle errors that occur during Google sign-in
    console.error("Error during Google Sign-In:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email || "Unknown email";

    // Provide more detailed error messages
    if (errorCode === "auth/popup-closed-by-user") {
      alert("Popup closed before completing the sign-in process.");
    } else {
      alert(`Error during sign-in: ${errorMessage}`);
    }

    console.error("Associated email:", email);
  }
});
