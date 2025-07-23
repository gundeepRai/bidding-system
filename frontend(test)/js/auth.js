// auth.js - Authentication functionality for BidWise

console.log("auth.js loaded");

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const navSignupBtn = document.getElementById('navSignupBtn');
const navLoginBtn = document.getElementById('navLoginBtn');
const formTitle = document.getElementById('formTitle');

// Password toggle elements
const loginPasswordToggle = document.getElementById('loginPasswordToggle');
const loginPassword = document.getElementById('loginPassword');
const signupPasswordToggle = document.getElementById('signupPasswordToggle');
const signupPassword = document.getElementById('signupPassword');
const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');

// Function to show signup form
function showSignupForm() {
  loginForm.classList.remove('active-form');
  loginForm.classList.add('inactive-form');
  signupForm.classList.remove('inactive-form');
  signupForm.classList.add('active-form');
  formTitle.textContent = 'Create Your Account';
  navSignupBtn.classList.remove('btn-inactive');
  navSignupBtn.classList.add('btn-active');
  navLoginBtn.classList.remove('btn-active');
  navLoginBtn.classList.add('btn-inactive');
}

// Function to show login form
function showLoginForm() {
  signupForm.classList.remove('active-form');
  signupForm.classList.add('inactive-form');
  loginForm.classList.remove('inactive-form');
  loginForm.classList.add('active-form');
  formTitle.textContent = 'Welcome to BidWise';
  navLoginBtn.classList.remove('btn-inactive');
  navLoginBtn.classList.add('btn-active');
  navSignupBtn.classList.remove('btn-active');
  navSignupBtn.classList.add('btn-inactive');
}

// Event listeners for form switching
switchToSignup.addEventListener('click', function(e) {
  e.preventDefault();
  showSignupForm();
});

switchToLogin.addEventListener('click', function(e) {
  e.preventDefault();
  showLoginForm();
});

navSignupBtn.addEventListener('click', function() {
  showSignupForm();
});

navLoginBtn.addEventListener('click', function() {
  showLoginForm();
});

// Password toggle functionality
function setupPasswordToggle(toggleElement, passwordField) {
  toggleElement.addEventListener('click', function() {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      toggleElement.textContent = 'Hide';
    } else {
      passwordField.type = 'password';
      toggleElement.textContent = 'Show';
    }
  });
}

// Set up password toggles
setupPasswordToggle(loginPasswordToggle, loginPassword);
setupPasswordToggle(signupPasswordToggle, signupPassword);
setupPasswordToggle(confirmPasswordToggle, signupConfirmPassword);

// Login functionality
document.getElementById('loginBtn').addEventListener('click', async function() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  
  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }
  
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save token in localStorage or sessionStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("user_name", data.user.name);

      // Redirect to All Products page
      window.location.href = "./AllProducts.html";
    } else {
      alert(data.error || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Try again later.");
  }
});

// Signup functionality
document.getElementById('signupBtn').addEventListener('click', async function() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }
  
  if (password.length < 8) {
    alert('Password must be at least 8 characters long.');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }
  
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password 
      })
    });
    
    const data = await response.json();
    
    console.log("Signup response:", data);
    if (response.ok) {
      // Save token in localStorage
      console.log("Signup successful:", data);
      
      alert("Registration successful! You can now log in.");
      // Redirect to Auth page
      window.location.href = "./auth.html";
    } else {
      alert(data.error || "Registration failed. Please try again.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong. Try again later.");
  }
});