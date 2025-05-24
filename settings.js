import { updateBalance, getBalance, setBalance, playSound, loginModalAppear } from './mutualCode.js';

let user = JSON.parse(localStorage.getItem('currentUser'));

const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name') || null;

const loginModal = document.querySelector('.login-modal');

const btnUsername = document.querySelector('.btn-username');
const btnBalanceReset = document.querySelector('.btn-balance-reset');
const btnDeleteAcc = document.querySelector('.btn-detele-acc');

const textUsername = document.querySelector('.text-username');
const usernameInput = document.querySelector('.input-username');

usernameInput.value = '';
usernameInput.style.visibility = 'hidden';

function handleUsername() {
    if (btnUsername.innerText === 'Cancel') {
        usernameInput.style.visibility = 'hidden';
        usernameInput.value = '';
        btnUsername.innerText = 'Change username';
        btnUsername.style.color = 'red';
        return;
    }

    if (btnUsername.innerText === 'Change username') {
        usernameInput.style.visibility = 'visible';
        usernameInput.focus();
        btnUsername.innerText = 'Cancel';
        btnUsername.style.color = 'red';
        return;
    }

    if (usernameInput.value === '') {
        loginModalAppear('Username cannot be empty');
        return;
    }

    let usernameTaken = false;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${usernameInput.value}_`)) {
            usernameTaken = true;
            break;
        }
    }

    if (usernameTaken) {
        loginModalAppear('This username is already taken');
        return;
    }

    const newUsername = {
        nick: usernameInput.value,
        pass: user.pass,
        balance: user.balance,
    };
    
    localStorage.removeItem(`currentUser`);
    
    localStorage.setItem(`currentUser`, JSON.stringify(newUsername));
    user = newUsername;
    
    if (navName) navName.innerText = usernameInput.value;
    textUsername.innerText = `Username: ${usernameInput.value}`;
    usernameInput.style.visibility = 'hidden';
    usernameInput.value = '';
    btnUsername.innerText = 'Change username';
    btnUsername.style.color = 'red';
}

function handleBalanceReset() {
    if (confirm('Are you sure you want to reset your balance to 0?')) {
        setBalance(0);
        updateBalance();
    }
}

function handleDeleteAcc() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
        localStorage.removeItem(`currentUser`);
        window.location.href = 'index.html'; //
    }
}

textUsername.innerText = `Username: ${user.nick}`;
if (navName) navName.innerText = user.nick;

btnUsername.addEventListener('click', handleUsername);
btnBalanceReset.addEventListener('click', handleBalanceReset);
btnDeleteAcc.addEventListener('click', handleDeleteAcc);

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