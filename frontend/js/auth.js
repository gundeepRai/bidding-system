// js/auth.js

// Toggle between forms
function toggleForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  loginForm.classList.toggle('hidden');
  signupForm.classList.toggle('hidden');
}

// Signup
async function registerUser() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (data.success) {
    alert('Registered! Please login.');
    toggleForms(); // switch to login
  } else {
    alert(data.message || 'Registration failed.');
  }
}

// Login
async function loginUser() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    alert('Login successful!');
    window.location.href = 'user_dashboard.html';
  } else {
    alert(data.message || 'Login failed.');
  }
}
