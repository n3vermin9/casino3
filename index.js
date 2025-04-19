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

function createCard(image, name, link) {
  const card = document.createElement('div')
  card.classList.add('card')

  const cardImg = document.createElement('img')
  cardImg.classList.add('card-img')
  cardImg.src = image
  card.appendChild(cardImg)

  const cardSection = document.createElement('div')
  cardSection.classList.add('card-section')
  card.appendChild(cardSection)

  const title = document.createElement('h1')
  title.textContent = name
  cardSection.appendChild(title)
  
  const btnPlay = document.createElement('button')
  btnPlay.classList.add('btn-play')
  cardSection.appendChild(btnPlay)

  const btnLink = document.createElement('a')
  btnLink.classList.add('btn-link')
  btnLink.href = link
  btnLink.textContent = 'dep'
  btnPlay.appendChild(btnLink)

  container.appendChild(card)
}

import { gamesList } from "./gamesList.js";



for (let i = 0; i < gamesList.length; i++) {
  createCard(gamesList[0].image, gamesList[0].name, gamesList[0].link)
}