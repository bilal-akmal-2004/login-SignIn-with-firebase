let message = document.querySelector("#message");
let logOut = document.querySelector("#logOut");

//getting local stoarge data
let userData = JSON.parse(localStorage.getItem("userData"));
console.log(userData);
message.innerText = `Email: ${userData.email}
Name: ${userData.userName}`;

logOut.addEventListener("click", () => {
  localStorage.removeItem("userData");
  window.location.replace("../signIn/sigIn.html");
});
