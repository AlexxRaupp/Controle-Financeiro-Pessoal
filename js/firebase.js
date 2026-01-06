import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGIQVXF8UwCH86zMU2mjxBIvyQ9xSXKM",
  authDomain: "controle-financeiro-e7c6e.firebaseapp.com",
  projectId: "controle-financeiro-e7c6e",
  storageBucket: "controle-financeiro-e7c6e.appspot.com",
  messagingSenderId: "734829903918",
  appId: "1:734829903918:web:801d9fdf3d42074c38dfbf"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
