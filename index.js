import { gamesList } from "./gamesList.js";

let user = JSON.parse(localStorage.getItem('currentUser'));
const balance = document.querySelector('.balance');

const container = document.querySelector('.container');

const btnAcc = document.querySelector('.btn-acc');
const accModal = document.querySelector('.acc-modal');
const modalBalance = document.querySelector('.modal-balance');
const btnBalanceAdd = document.querySelector('.balance-add');

const modalClose = document.querySelector('.modal-close');
const btnModalLogout = document.querySelector('.modal-logout');
const btnModalLogoutLink = document.querySelector('.modal-logout-link');

const modalName = document.querySelector('.modal-name');

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
  
  if (localStorage.getItem('currentUser')) {
    btnLink.href = link;
  } else {
    btnLink.href =  'login.html'
  }

  btnLink.textContent = 'Play';
  btnPlay.appendChild(btnLink);

  container.appendChild(card);
}

gamesList.forEach(game => {
  createCard(game.image, game.name, game.link, game.filter);
});



if (localStorage.getItem('currentUser')) {
  modalName.innerText = user.nick
  btnModalLogoutLink.innerText = 'Log out'
} else {
  btnBalanceAdd.style.display = 'none'
}


let isModalLogout = false

btnModalLogout.addEventListener('click', () => {
  if (!user) {
    btnModalLogoutLink.href =  'login.html'
  }
  if (isModalLogout) {
    btnModalLogoutLink.href =  'login.html'
    let data = {
      nick: user.nick,
      pass: user.pass,
      balance: user.balance,
    }
    localStorage.setItem(`${user.nick}_${user.pass}`, JSON.stringify(data))
    localStorage.removeItem('currentUser');
  }
  isModalLogout = true
  btnModalLogout.style.background = 'none'
  btnModalLogout.style.border = '1px solid #fff'
  btnModalLogoutLink.style.color = '#fff'

})


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