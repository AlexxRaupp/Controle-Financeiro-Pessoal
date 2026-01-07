const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const forms = document.getElementById("forms");
const msg = document.getElementById("msg");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Alternar abas
loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  msg.textContent = "";
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  msg.textContent = "";
};

// CADASTRO
registerForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const pass = registerPassword.value;
  const confirm = confirmPassword.value;

  if (pass !== confirm) {
    msg.textContent = "❌ Senhas não conferem";
    msg.className = "msg error";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    msg.textContent = "❌ Email já cadastrado";
    msg.className = "msg error";
    return;
  }

  users.push({ name, email, pass });
  localStorage.setItem("users", JSON.stringify(users));

  msg.textContent = "✅ Cadastro realizado com sucesso!";
  msg.className = "msg success";

  registerForm.reset();
  loginTab.click();
});

// LOGIN
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const pass = loginPassword.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    msg.textContent = "❌ Email ou senha inválidos";
    msg.className = "msg error";
    return;
  }

  localStorage.setItem("loggedUser", JSON.stringify(user));
  window.location.href = "home.html";
});
