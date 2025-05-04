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

function createCard(image, name, link, shouldFilter) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardImg = document.createElement('img');
  cardImg.classList.add('card-img');
  cardImg.src = image;
  
  // Apply grayscale filter by default (as per your CSS)
  cardImg.style.filter = 'grayscale(100%)';
  
  // Add invert filter if shouldFilter is true
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

// Create cards using the imported gamesList
gamesList.forEach(game => {
  createCard(game.image, game.name, game.link, game.filter);
});