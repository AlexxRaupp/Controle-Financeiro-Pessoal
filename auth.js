import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

// LOGIN
btnLogin.addEventListener("click", () => {
  signInWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  )
    .then(() => {
      window.location.href = "app.html";
    })
    .catch(error => {
      alert(error.message);
    });
});

// CADASTRO
btnRegister.addEventListener("click", () => {
  createUserWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  )
    .then(() => {
      window.location.href = "app.html";
    })
    .catch(error => {
      alert(error.message);
    });
});

// SE JÁ ESTIVER LOGADO, PULA LOGIN
onAuthStateChanged(auth, user => {
  if (user) {
    window.location.href = "app.html";
  }
});
