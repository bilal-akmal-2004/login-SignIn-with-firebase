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
      window.location.replace("../home/home.html");
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

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// import {
//   onValue,
//   getDatabase,
//   ref,
//   child,
//   set,
//   get,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDfgK34boUe0T77KFpteYvMRCYJ-aXOjqc",
//   authDomain: "verysimpleuserform.firebaseapp.com",
//   projectId: "verysimpleuserform",
//   storageBucket: "verysimpleuserform.firebasestorage.app",
//   messagingSenderId: "712556880799",
//   appId: "1:712556880799:web:c9ae8ce0632ae17b68d3aa",
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase();
// const auth = getAuth(app);

// let emailInp = document.querySelector("#emailInp");
// let passwordInp = document.querySelector("#passwordInp");
// let mainForm = document.querySelector("#mainForm");

// let signIn = async (event) => {
//   event.preventDefault();
//   signInWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
//     .then((credentials) => {
//       //   set(ref());
//       alert("comrect pasword!");
//       let uid = credentials.user.uid;
//       console.log(credentials);
//       // ----------------------------------------------------------------------
//       //this for the info for the data from the
//       const dbref = ref(db);
//       get(child(dbref, "Users/" + uid)).then((snapShot) => {
//         console.log(snapShot.val());
//         if (snapShot.exists()) {
//           var fname = snapShot.val().firstName;
//           var lname = snapShot.val().lastName;
//           console.log(fname + lname);
//         }
//       });
//       // ----------------------------------------------------------------------

//       if (!localStorage.getItem("userData")) {
//         localStorage.setItem(
//           "userData",
//           JSON.stringify({
//             email: emailInp.value,
//             userName: `${firstName} ${lastName}`,
//           })
//         );
//       }
//       // --------------------------------------------------------------------------------
//     })
//     .catch((error) => {
//       console.log(error.code);
//       console.log(error.message);
//     });
// };
// mainForm.addEventListener("submit", signIn);

// // const dbRef = ref(db, "Users");
// // onValue(dbRef, (snapshot) => {
// //   const data = snapshot.val();

// //   // Process the retrieved data here
// //   console.log(data);

// //   // Update UI, etc.
// // });
