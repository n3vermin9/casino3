export function redirectUser() {
  const ALLOWED_PAGES = ['index.html', 'login.html', 'register.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (
    (!getCurrentUser() || getCurrentUser().nick === 'Guest') && 
    !ALLOWED_PAGES.includes(currentPage)
  ) {
    window.location.href = '../index.html';
  }
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : { 
        balance: 0, 
        nick: 'Guest', 
        history: [] 
    };
}

export function updateUserData(updates) {
    const user = getCurrentUser();
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
}

export function setBalance(newBalance) {
    updateUserData({ balance: newBalance });
    updateBalance();
}

export function getBalance() {
    return getCurrentUser().balance;
}

export function updateBalance() {
    const user = getCurrentUser();
    const balanceElement = document.querySelector('.balance');
    const navName = document.querySelector('.nav-name');
    
    if (balanceElement) balanceElement.textContent = user.balance;
    if (navName) navName.textContent = user.nick;
}

export function loginModalAppear(text) {
    const loginModal = document.querySelector('.login-modal');
    if (!loginModal) return;
    
    loginModal.textContent = text;
    loginModal.classList.add('appear');
    
    setTimeout(() => {
        loginModal.classList.remove('appear');
    }, 2000);
}

export function logHistory(gameName, amount) {
    const now = new Date();
    const time = [
        String(now.getHours()).padStart(2, '0'), ':',
        String(now.getMinutes()).padStart(2, '0'), ' ',
        String(now.getDate()).padStart(2, '0'), '/',
        String(now.getMonth() + 1).padStart(2, '0')
    ].join('');

    const currentUser = getCurrentUser();
    const updatedHistory = [
        ...(currentUser.history || []),
        {
            game: gameName,
            money: amount,
            time: time
        }
    ];
    
    updateUserData({ history: updatedHistory });
}

updateBalance()