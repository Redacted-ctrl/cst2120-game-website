// - Game User Module -
// handles user session display, logout, and saving player scores

// checks if user is logged in and displays info
export function setupUserSession() {
  // gets the currently logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userInfoDiv = document.getElementById('userInfo');

  // checks if userInfo div exists on this page
  if (!userInfoDiv) {
    console.warn('userInfo div not found in this page.');
    return;
  }

  // redirects to login page if no active user session
  if (!loggedInUser) {
    console.log('Redirecting to login: no user session found.');
    window.alert('You must log in to play the game.');
    window.location.href = './login.html';
    return;
  }

  // displays welcome message and logout button
  userInfoDiv.innerHTML = `
    <p>Welcome, <strong>${loggedInUser.name}</strong>!</p>
    <button id="logoutBtn" class="btn small-btn">Logout</button>
  `;

  // adds logout functionality to button
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    // goes up one directory since game.html is inside /pages/
    window.location.href = '../index.html';
  });
}

// saves the score when the game ends
export function saveScoreToUser(score) {
  // gets logged-in user session
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    console.warn('No logged-in user found; cannot save score.');
    return;
  }

  // gets full user record using their email as key
  const userData = JSON.parse(localStorage.getItem(loggedInUser.email));
  if (!userData) return;

  // ensures user has a scores array
  if (!userData.scores) userData.scores = [];

  // adds new score
  userData.scores.push(score);

  // sorts scores from highest to lowest and keeps top 5 only
  userData.scores.sort((a, b) => b - a);
  userData.scores = userData.scores.slice(0, 5);

  // updates highest score
  userData.highScore = userData.scores[0];

  // saves updated user data to their main record
  localStorage.setItem(loggedInUser.email, JSON.stringify(userData));

  // updates current session user data
  localStorage.setItem('loggedInUser', JSON.stringify(userData));

  console.log(`💾 Score ${score} saved for ${userData.name}`);
}

// cleans up duplicate leftover 'loggedInUser' entries from old saves
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // checks and syncs loggedInUser with their main record if mismatched
  if (loggedInUser && localStorage.getItem(loggedInUser.email)) {
    const mainRecord = JSON.parse(localStorage.getItem(loggedInUser.email));

    if (JSON.stringify(loggedInUser) !== JSON.stringify(mainRecord)) {
      localStorage.setItem('loggedInUser', JSON.stringify(mainRecord));
      console.log('🧹 Synced loggedInUser with main record to prevent duplicates.');
    }
  }
});

