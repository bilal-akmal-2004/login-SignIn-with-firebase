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
  child,
  get,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
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
let mainForm = document.querySelector("#mainForm");

async function signIn(event) {
  event.preventDefault();

  try {
    const credentials = await signInWithEmailAndPassword(
      auth,
      emailInp.value,
      passwordInp.value
    );
    alert("Correct password!");
    const uid = credentials.user.uid;
    console.log(credentials);

    // Get user data
    const userRef = child(ref(db), "Users/" + uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const firstName = userData.firstName;
      const lastName = userData.lastName;
      console.log(firstName + lastName);

      // Use userData (firstName, lastName) here
      if (!localStorage.getItem("userData")) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: emailInp.value,
            userName: `${firstName} ${lastName}`,
          })
        );
        window.location.replace("../home/home.html");
      }
    } else {
      console.log("No data found for user with UID:", uid);
    }
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
  }
}

mainForm.addEventListener("submit", signIn);

const provider = new GoogleAuthProvider();
document.getElementById("google-login").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      // Extract user info from the result
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Check if the user exists in the database
      const userRef = ref(db, "Users/" + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // If user exists, proceed with the login process
        console.log("User exists:", user);

        // Store user data in localStorage
        if (!localStorage.getItem("userData")) {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              email: user.email,
              userName: user.displayName,
            })
          );
        }

        // Redirect to home page
        window.location.replace("../home/home.html");
      } else {
        // If user doesn't exist, show an error and prevent login
        console.log("User does not exist in the database.");
        alert("You are not registered. Please contact support or sign up.");
        // Optionally, you can sign the user out here
        signOut(auth);
      }
    })
    .catch((error) => {
      // Handle Errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error:", errorMessage);

      // The email of the user's account used.
      const email = error.customData?.email;
      console.error("Associated email:", email);

      // Handle specific error codes
      if (errorCode === "auth/popup-closed-by-user") {
        alert("Popup closed before completing the sign-in process.");
      } else {
        alert("Error during sign-in: " + errorMessage);
      }
    });
});
