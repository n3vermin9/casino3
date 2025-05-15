// balance block

const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name') || null;

let user = JSON.parse(localStorage.getItem('currentUser'));

if (navName) {
  navName.innerText = user.nick
}

export function setBalance(value) {
  // Get current user from localStorage
  let user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    // Update user's balance
    user.balance = value;
    // Save updated user back to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export function updateBalance() {
  // Get current user from localStorage
  let user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    // Update the displayed balance
    balance.innerText = parseInt(user.balance) || 0;
  } else {
    // Fallback if no user is logged in
    balance.innerText = 0;
  }
}

export function getBalance() {
  // Get current user from localStorage
  let user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    return user.balance;
  }
  return 0; // Default balance if no user
}

updateBalance();

// balance block

export function playSound() {
  const audio = new Audio('btnDep.mp3');
  audio.play();
}