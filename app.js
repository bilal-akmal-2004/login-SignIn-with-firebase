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

let registerData = (event) => {
  event.preventDefault();
  createUserWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
    .then((credentials) => {
      const firebaseUser = credentials.user;
      const { uid } = firebaseUser;

      set(ref(db, `Users/${uid}`), {
        id: uid,
        firstName: fnameInp.value,
        lastName: lnameInp.value,
        email: emailInp.value,
      });
      console.log("Data stored succesfully.");
      console.log(credentials);
      alert("Data stored succesfully.");

      //her we are doing the local storage code
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
    })
    .catch((error) => {
      if (error.code === `auth/email-already-in-use`) {
        alert("Email already exits.");
      }
      if (error.code === `auth/weak-password`) {
        alert("Password should be 6 letter long.");
      }
      console.log(error.code);
      console.log(error.message);
    });
};
mainForm.addEventListener("submit", registerData);

const provider = new GoogleAuthProvider();
document.getElementById("google-login").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      if (!localStorage.getItem("userData")) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: user.email,
            userName: user.displayName,
          })
        );
      }
      window.location.replace("./home/home.html");
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // The email of the user's account used.
      const email = error.customData.email;
      console.log(email);
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});
