import { gamesList } from "./gamesList.js";


// balance block

const balance = document.querySelector('.balance');




function setBalance(value) {
  localStorage.setItem('balance', value)
}

function updateBalance() {
  const balanceValue = localStorage.getItem('balance');
  balance.innerText = parseInt(balanceValue) || 0;
}

function getBalance() {
  return localStorage.getItem('balance')
}


if (!getBalance()) {
  setBalance(0)
  updateBalance()
}else {
  updateBalance()
}

// balance block

const container = document.querySelector('.container');

const btnAcc = document.querySelector('.btn-acc');
const accModal = document.querySelector('.acc-modal');
const modalBalance = document.querySelector('.modal-balance');
const modalClose = document.querySelector('.modal-close');

function createCard(image, name, link, shouldFilter) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardImg = document.createElement('img');
  cardImg.classList.add('card-img');
  cardImg.src = image;
  
  cardImg.style.filter = 'grayscale(100%)';
  
  if (shouldFilter) {
    cardImg.style.filter += ' invert(100%)';
  }
  
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
  btnLink.href = link;
  btnLink.textContent = 'Play';
  btnPlay.appendChild(btnLink);

  container.appendChild(card);
}

gamesList.forEach(game => {
  createCard(game.image, game.name, game.link, game.filter);
});


btnAcc.addEventListener('click', (e) => {
  e.stopPropagation();
  accModal.classList.add('opened');
  btnAcc.style.visibility = 'hidden';
  modalBalance.innerText = balance.innerText;
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
})