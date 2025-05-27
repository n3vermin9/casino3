import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   updateUserData,
   redirectUser,
   loginModalAppear,
} from '../mutualCode.js';


const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name') || null;

const btnUsername = document.querySelector('.btn-username');
const btnBalanceReset = document.querySelector('.btn-balance-reset');
const btnDeleteAcc = document.querySelector('.btn-detele-acc');
const btnClearHistory = document.querySelector('.btn-clear-history');

const textUsername = document.querySelector('.text-username');
const usernameInput = document.querySelector('.input-username');


// Initialize UI
redirectUser()
usernameInput.value = '';
usernameInput.style.visibility = 'hidden';
textUsername.textContent = `Username: ${getCurrentUser().nick}`;
if (navName) navName.textContent = getCurrentUser().nick;

function handleUsername() {
    if (btnUsername.textContent === 'Cancel') {
        resetUsernameInput();
        return;
    }

    if (btnUsername.textContent === 'Change username') {
        showUsernameInput();
        return;
    }

    if (usernameInput.value === '') {
        loginModalAppear('Username can\nt be empty')
        return;
    }

    if (isUsernameTaken(usernameInput.value)) {
        loginModalAppear('Username is already taken')
        return;
    }

    saveNewUsername(usernameInput.value);
}

function resetUsernameInput() {
    usernameInput.style.visibility = 'hidden';
    usernameInput.value = '';
    btnUsername.textContent = 'Change username';
    btnUsername.style.color = 'red';
}

function showUsernameInput() {
    usernameInput.style.visibility = 'visible';
    usernameInput.focus();
    btnUsername.textContent = 'Cancel';
    btnUsername.style.color = 'red';
}

function isUsernameTaken(username) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${username}_`)) {
            return true;
        }
    }
    return false;
}

function saveNewUsername(newUsername) {
    const currentUser = getCurrentUser();
    const updatedUser = {
        ...currentUser,
        nick: newUsername
    };
    
    // Update both currentUser and stored user data
    updateUserData({ nick: newUsername });
    localStorage.setItem(`currentUser`, JSON.stringify(updatedUser));

    
    if (navName) navName.textContent = newUsername;
    textUsername.textContent = `Username: ${newUsername}`;
    resetUsernameInput();
}

let interval;
let activeConfirmation = null;

function disableOtherButtons(activeBtn) {
    const buttons = [btnBalanceReset, btnDeleteAcc, btnClearHistory];
    buttons.forEach(btn => {
        if (btn !== activeBtn) {
            btn.disabled = true;
            btn.style.opacity = '0.2';
        }
    });
}

function enableAllButtons() {
    [btnBalanceReset, btnDeleteAcc, btnClearHistory].forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
}

function handleConfirmation(btn, text, type, action) {
    let counter = 9;
    btn.textContent = `Confirm (${counter})`;
    counter--;
    
    clearInterval(interval);
    activeConfirmation = type;
    disableOtherButtons(btn);
    
    interval = setInterval(() => {
        if (counter < 0) {
            btn.textContent = text;
            clearInterval(interval);
            activeConfirmation = null;
            enableAllButtons();
            return;
        }
        btn.textContent = `Confirm (${counter})`;
        counter--;
    }, 1000);
}

function handleBalanceReset() {
    if (getBalance() === 0) return;
    
    if (activeConfirmation && activeConfirmation !== 'reset') return;
    
    if (activeConfirmation !== 'reset') {
        handleConfirmation(btnBalanceReset, 'Reset balance', 'reset', () => {
            setBalance(0);
            updateBalance();
        });
        return;
    }
    
    clearInterval(interval);
    setBalance(0);
    btnBalanceReset.textContent = 'Reset balance';
    activeConfirmation = null;
    enableAllButtons();
}

function handleDeleteAcc() {
    if (activeConfirmation && activeConfirmation !== 'delete') return;
    
    if (activeConfirmation !== 'delete') {
        handleConfirmation(btnDeleteAcc, 'Delete account', 'delete', () => {
            localStorage.removeItem('currentUser');
            location.reload()
        });
        return;
    }
    
    clearInterval(interval);
    localStorage.removeItem('currentUser');
    location.reload()
}

function handleClearHistory() {
    if (getCurrentUser().history.length === 0) return;
    
    if (activeConfirmation && activeConfirmation !== 'clear') return;
    
    if (activeConfirmation !== 'clear') {
        handleConfirmation(btnClearHistory, 'Clear history', 'clear', () => {
            updateUserData({ history: [] });
        });
        return;
    }
    
    clearInterval(interval);
    updateUserData({ history: [] });
    btnClearHistory.textContent = 'Clear history';
    activeConfirmation = null;
    enableAllButtons();
}

// Event listeners
btnUsername.addEventListener('click', handleUsername);
btnBalanceReset.addEventListener('click', handleBalanceReset);
btnDeleteAcc.addEventListener('click', handleDeleteAcc);
btnClearHistory.addEventListener('click', handleClearHistory);

usernameInput.addEventListener('input', function() {
    if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
    }
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
    
    if (this.value.length > 0) {
        btnUsername.textContent = 'Save username';
        btnUsername.style.color = 'green';
    } else {
        btnUsername.textContent = 'Cancel';
        btnUsername.style.color = 'red';
    }
});

usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.length > 0) {
        handleUsername();
    }
});