import {
   updateBalance,
   getBalance,
   setBalance,
   playSound,
   logHistory,
   getCurrentUser,
  } from '../mutualCode.js';


const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name') || null;

const btnUsername = document.querySelector('.btn-username');
const btnBalanceReset = document.querySelector('.btn-balance-reset');
const btnDeleteAcc = document.querySelector('.btn-detele-acc');
const btnClearHistory = document.querySelector('.btn-clear-history');

const textUsername = document.querySelector('.text-username');
const usernameInput = document.querySelector('.input-username');

usernameInput.value = '';
usernameInput.style.visibility = 'hidden';

function handleUsername() {
    if (btnUsername.innerText === 'Cancel') {
        resetUsernameInput();
        return;
    }

    if (btnUsername.innerText === 'Change username') {
        showUsernameInput();
        return;
    }

    if (usernameInput.value === '') {
        loginModalAppear('Username cannot be empty');
        return;
    }

    if (isUsernameTaken(usernameInput.value)) {
        loginModalAppear('This username is already taken');
        return;
    }

    saveNewUsername(usernameInput.value);
}

function resetUsernameInput() {
    usernameInput.style.visibility = 'hidden';
    usernameInput.value = '';
    btnUsername.innerText = 'Change username';
    btnUsername.style.color = 'red';
}

function showUsernameInput() {
    usernameInput.style.visibility = 'visible';
    usernameInput.focus();
    btnUsername.innerText = 'Cancel';
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
    const updatedUser = {
        nick: newUsername,
        pass: getCurrentUser().pass,
        balance: getCurrentUser().balance,
    };
    
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    let user = getCurrentUser()
    user = updatedUser;
    
    if (navName) navName.innerText = newUsername;
    textUsername.innerText = `Username: ${newUsername}`;
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

function handleCertain(btn, text, type) {
    let counter = 9;
    btn.innerText = `Confirm (${counter})`;
    counter--;
    
    clearInterval(interval);
    activeConfirmation = type;
    disableOtherButtons(btn);
    
    interval = setInterval(() => {
        if (counter < 0) {
            btn.innerText = text;
            clearInterval(interval);
            activeConfirmation = null;
            enableAllButtons();
            return;
        }
        btn.innerText = `Confirm (${counter})`;
        counter--;
    }, 1000);
}

function handleBalanceReset() {
    if (balance.innerText === '0') return;
    
    if (activeConfirmation && activeConfirmation !== 'reset') return;
    
    if (activeConfirmation !== 'reset') {
        handleCertain(btnBalanceReset, 'Reset balance', 'reset');
        return;
    }
    
    clearInterval(interval);
    setBalance(0);
    updateBalance();
    btnBalanceReset.innerText = 'Reset balance';
    activeConfirmation = null;
    enableAllButtons();
}

function handleDeleteAcc() {
    if (activeConfirmation && activeConfirmation !== 'delete') return;
    
    if (activeConfirmation !== 'delete') {
        handleCertain(btnDeleteAcc, 'Delete account', 'delete');
        return;
    }
    
    clearInterval(interval);
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function handleClearHistory() {
    if (getCurrentUser().history == []) return;
    
    if (activeConfirmation && activeConfirmation !== 'clear') return;
    
    if (activeConfirmation !== 'clear') {
        handleCertain(btnClearHistory, 'Clear history', 'clear');
        return;
    }
    
    clearInterval(interval);
    // Actually clear the history here
    const user = getCurrentUser();
    user.history = [];
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    btnClearHistory.innerText = 'Clear history';
    activeConfirmation = null;
    enableAllButtons();
}

textUsername.innerText = `Username: ${getCurrentUser().nick}`;
if (navName) navName.innerText = getCurrentUser().nick;

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
        btnUsername.innerText = 'Save username';
        btnUsername.style.color = 'green';
    } else {
        btnUsername.innerText = 'Cancel';
        btnUsername.style.color = 'red';
    }
});

usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.length > 0) {
        handleUsername();
    }
});