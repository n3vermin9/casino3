export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
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

export function updateBalance() {
    const balanceElement = document.querySelector('.balance');
    if (balanceElement) {
        balanceElement.textContent = getCurrentUser().balance;
    }
    
    const navName = document.querySelector('.nav-name');
    if (navName) {
        navName.textContent = getCurrentUser().nick;
    }
}

export function getBalance() {
    return getCurrentUser().balance;
}

export function playSound() {
    const audio = new Audio('btnDep.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
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

updateBalance();