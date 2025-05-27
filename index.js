import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   updateUserData,
} from './mutualCode.js';

import { gamesList } from "./gamesList.js";

// DOM Elements
const balance = document.querySelector('.balance');
const container = document.querySelector('.container');
const btnAcc = document.querySelector('.btn-acc');
const accModal = document.querySelector('.acc-modal');
const modalBalance = document.querySelector('.modal-balance');
const btnBalanceAdd = document.querySelector('.balance-add');
const modalClose = document.querySelector('.modal-close');
const btnModalLogout = document.querySelector('.modal-logout');
const btnModalLogoutLink = document.querySelector('.modal-logout-link');
const modalSettings = document.querySelector('.modal-settings');
const modalHistory = document.querySelector('.modal-history');
const modalName = document.querySelector('.modal-name');

// Initialize user state
function initializeUser() {
    const currentUser = getCurrentUser(); // Get the current user
    
    if (currentUser && currentUser.nick !== 'Guest') {
        // User is logged in
        modalName.textContent = currentUser.nick;
        btnModalLogoutLink.textContent = 'Log out';
        updateBalance();
        
        // Show user-specific elements
        btnBalanceAdd.style.display = '';
        modalHistory.style.display = '';
        modalSettings.style.display = '';
    } else {
        // Guest user
        modalName.textContent = 'Guest';
        balance.textContent = '0';
        btnModalLogoutLink.textContent = 'Log in';
        
        // Hide user-specific elements
        btnBalanceAdd.style.display = 'none';
        modalHistory.style.display = 'none';
        modalSettings.style.display = 'none';
    }
}

// Card creation function
function createCard(image, name, link, shouldFilter) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img');
    cardImg.src = image;
    cardImg.style.filter = 'grayscale(100%)' + (shouldFilter ? ' invert(100%)' : '');
    card.appendChild(cardImg);

    const cardSection = document.createElement('div');
    cardSection.classList.add('card-section');
    card.appendChild(cardSection);

    const title = document.createElement('h1');
    title.textContent = name;
    cardSection.appendChild(title);
    
    const btnPlay = document.createElement('button');
    btnPlay.classList.add('btn-play');
    cardSection.appendChild(btnPlay);

    const btnLink = document.createElement('a');
    btnLink.classList.add('btn-link');
    btnLink.textContent = 'Play';
    btnLink.href = getCurrentUser().nick !== 'Guest' ? link : 'login/login.html';
    btnPlay.appendChild(btnLink);

    container.appendChild(card);
}

// Initialize the page
function init() {
    // Create game cards
    gamesList.forEach(game => {
        createCard(game.image, game.name, game.link, game.filter);
    });

    // Set up user state
    initializeUser();

    // Logout button handler
    let isModalLogout = false;
    btnModalLogout.addEventListener('click', () => {
        const user = getCurrentUser();
        
        if (user.nick === 'Guest') {
            btnModalLogoutLink.href = 'login/login.html';
            return;
        }

        btnModalLogoutLink.style.color = 'red';
        
        if (isModalLogout) {
            // Save user data before logging out
            localStorage.setItem(`${user.nick}_${user.pass}`, JSON.stringify({
                nick: user.nick,
                pass: user.pass,
                balance: user.balance,
                history: user.history,
            }));
            
            localStorage.removeItem('currentUser');
            window.location.reload(); // Refresh to show guest state
        }
        
        isModalLogout = true;
    });

    // Account modal handlers
    btnAcc.addEventListener('click', (e) => {
        e.stopPropagation();
        accModal.classList.toggle('opened');
        btnAcc.style.visibility = 'hidden';
        modalBalance.textContent = balance.textContent;
        balance.style.visibility = 'hidden';
    });

    document.addEventListener('click', (e) => {
        if (accModal.classList.contains('opened') && !e.target.closest('.modal')) {
            accModal.classList.remove('opened');
            btnAcc.style.visibility = 'visible';
            balance.style.visibility = 'visible';
        }
    });

    accModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    modalClose.addEventListener('click', () => {
        accModal.classList.remove('opened');
        btnAcc.style.visibility = 'visible';
        balance.style.visibility = 'visible';
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);