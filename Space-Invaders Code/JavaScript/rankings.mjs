// - Rankings Module -
// displays all users’ top scores stored in localStorage in a ranking table

// collects player data from localStorage, sorts by score, and updates the rankings table
export function displayRankings() {
  const users = []

  // collects users from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    // skips session data to prevent duplicates in rankings
    if (key === 'loggedInUser') continue

    try {
      const userData = JSON.parse(localStorage.getItem(key))

      if (userData && userData.name) {
        let highScore = 0

        // if userData.highScore exists and is a finite number, use it
        if (typeof userData.highScore === 'number' && isFinite(userData.highScore)) {
          highScore = userData.highScore
        }
        // otherwise, find the highest valid score in the array
        else if (Array.isArray(userData.scores) && userData.scores.length > 0) {
          const validScores = userData.scores.filter(s => typeof s === 'number' && isFinite(s))
          highScore = validScores.length > 0 ? Math.max(...validScores) : 0
        }

        // adds player and score to the users list
        users.push({
          name: userData.name,
          highScore: highScore || 0
        })
      }
    } catch (err) {
      // ignores invalid JSON entries
      continue
    }
  }

  // sorts users by top score in descending order
  users.sort((a, b) => b.highScore - a.highScore)

  const tableBody = document.querySelector('#rankingsTable tbody')

  if (!tableBody) {
    console.error('Could not find table body! Check your rankings.html IDs.')
    return
  }

  // clears any existing rows
  tableBody.innerHTML = ''

  if (users.length === 0) {
    // displays message if there are no scores yet
    const row = document.createElement('tr')
    const cell = document.createElement('td')
    cell.colSpan = 3
    cell.textContent = 'No scores yet. Play the game to appear here!'
    row.appendChild(cell)
    tableBody.appendChild(row)
  } else {
    // populates table with player rankings
    users.forEach((user, index) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.highScore}</td>
      `
      tableBody.appendChild(row)
    })
  }
}

// runs displayRankings once the page has fully loaded
document.addEventListener('DOMContentLoaded', displayRankings)


