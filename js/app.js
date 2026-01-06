import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
});

document.getElementById("logout").onclick = () => {
  signOut(auth).then(() => window.location.href = "index.html");
};
