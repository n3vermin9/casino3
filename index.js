import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   updateUserData,
} from './mutualCode.js';

import { gamesList } from "./gamesList.js";

const nav = document.querySelector('.nav');
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

// test
modalBalance.addEventListener('click', () => {
  const data = {
    nick: 'test',
    pass: 'test000',
    balance: 1000,
    history: [
      {game: 'Tg Slots', money: '+100', time: '19:25 04/02'},
      {game: 'Tg Slots', money: '-100', time: '12:40 02/06'},
      {game: 'Pirates', money: '+100', time: '13:53 08/03'},
    ]
  };
  localStorage.setItem(`currentUser`, JSON.stringify(data));
  location.reload();
});
// test

function initializeUser() {
    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser.nick !== 'Guest') {

        modalName.textContent = currentUser.nick;
        btnModalLogoutLink.textContent = 'Log out';
        updateBalance();
        
        btnBalanceAdd.style.display = '';
        modalHistory.style.display = '';
        modalSettings.style.display = '';
    } else {
        modalName.textContent = 'Guest';
        balance.textContent = '0';
        btnModalLogoutLink.textContent = 'Log in';
        
        btnBalanceAdd.style.display = 'none';
        modalHistory.style.display = 'none';
        modalSettings.style.display = 'none';
    }
}

let cardElements = [];

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

    cardElements.push(card);

    container.appendChild(card);

    const index = cardElements.length - 1;
    ScrollReveal().reveal(card, {
        delay: 200 + (index * 100),
        distance: '20px',
        duration: 1000,
        origin: index % 2 === 0 ? 'left' : 'right',
    });
}

function init() {
    gamesList.forEach(game => {
        createCard(game.image, game.name, game.link, game.filter);
    });

    initializeUser();

    let isModalLogout = false;
    btnModalLogout.addEventListener('click', () => {
        const user = getCurrentUser();
        
        if (user.nick === 'Guest') {
            btnModalLogoutLink.href = 'login/login.html';
            return;
        }

        btnModalLogoutLink.style.color = 'red';
        
        if (isModalLogout) {
            localStorage.setItem(`${user.nick}_${user.pass}`, JSON.stringify({
                nick: user.nick,
                pass: user.pass,
                balance: user.balance,
                history: user.history,
            }));
            
            localStorage.removeItem('currentUser');
            window.location.reload();
        }
        
        isModalLogout = true;
    });

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

ScrollReveal().reveal('.nav', {
  delay: 200,
  distance: '20px',
  duration: 700,
  origin: 'top'
});

document.addEventListener('DOMContentLoaded', init);