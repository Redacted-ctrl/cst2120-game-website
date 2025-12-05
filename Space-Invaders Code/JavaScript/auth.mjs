// - Authentication Module -
// Handles user registration and login validation

// - Registration -
export function setupRegistration() {
  const registerForm = document.getElementById('registerForm');
  const message = document.getElementById('message');

  // checks if registration form exists before adding event listener
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault(); // prevents page reload on submit

      // gets and cleans user input values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // checks all fields are filled in
      if (!name || !email || !phone || !password || !confirmPassword) {
        return showMessage('All fields are required.', 'red');
      }

      // checks for valid email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return showMessage('Invalid email format.', 'red');
      }

      // checks for valid UK-style phone number (starts with 0 and 11 digits)
      const phonePattern = /^0\d{10}$/;
      if (!phonePattern.test(phone)) {
        return showMessage('Phone must start with 0 and be 11 digits.', 'red');
      }

      // checks for strong password (min 8 chars, one uppercase, one number)
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordPattern.test(password)) {
        return showMessage(
          'Password must have 8+ characters, one uppercase letter, and one number.',
          'red'
        );
      }

      // checks if passwords match
      if (password !== confirmPassword) {
        return showMessage('Passwords do not match.', 'red');
      }

      // checks if email already exists in localStorage
      if (localStorage.getItem(email)) {
        return showMessage('Email already registered.', 'red');
      }

      // creates user object with all info and default values
      const user = {
        name,
        email,
        phone,
        password,
        scores: [],
        highScore: 0
      };

      // saves new user to localStorage
      localStorage.setItem(email, JSON.stringify(user));

      // shows success message
      showMessage('Registration successful! You can now log in.', 'lime');

      // resets form fields
      registerForm.reset();
    });
  }

  // function for registration feedback
  function showMessage(text, color) {
    if (message) {
      message.textContent = text;
      message.style.color = color;
    }
  }
}

// - Login -
export function setupLogin() {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  // checks if login form exists before adding event listener
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault(); // prevents form reload

      // gets email and password input values
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      // checks fields are not empty
      if (!email || !password) {
        return showLoginMessage('Please fill in all fields.', 'red');
      }

      // gets stored user from localStorage
      const storedUser = localStorage.getItem(email);
      if (!storedUser) {
        return showLoginMessage('No account found with that email.', 'red');
      }

      // converts stored user JSON string back to object
      const user = JSON.parse(storedUser);

      // checks if entered password matches stored one
      if (user.password !== password) {
        return showLoginMessage('Incorrect password.', 'red');
      }

      // Successful login is stored in localStorage 
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // shows success message and redirects after delay
      showLoginMessage('Login successful! Redirecting...', 'lime');
      loginForm.reset();

      setTimeout(() => {
        // redirects to game page
        window.location.href = './game.html';
      }, 1000);
    });
  }

  // function for login feedback
  function showLoginMessage(text, color) {
    if (loginMessage) {
      loginMessage.textContent = text;
      loginMessage.style.color = color;
    }
  }
}


