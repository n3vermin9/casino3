import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
} from '../mutualCode.js';

const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name')


const historyContainer = document.querySelector('.container-history');

// let usee = getCurrentUser()
// usee.history = []
// localStorage.setItem('currentUser', JSON.stringify(usee));


function createCard(name, amount, time) {
  const card = document.createElement('div');
  card.classList.add('card');

  const triangle = document.createElement('div');
  triangle.innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408z" /></svg>'
  triangle.classList.add('triangle');

  
  const title = document.createElement('div');
  title.textContent = name;
  title.classList.add('card-title');
  
  const moneyTitle = document.createElement('div');
  moneyTitle.textContent = amount;
  moneyTitle.classList.add('card-amount')

  const timeTitle = document.createElement('div');
  timeTitle.textContent = time;
  timeTitle.classList.add('card-time')
  
  if (amount[0] == '-') {
    triangle.style.color = 'red'
    moneyTitle.style.color = 'red'
    triangle.style.transform = 'rotate(180deg)'
  } else {
    triangle.style.color = '#7FFF00'
    moneyTitle.style.color = '#7FFF00'
  }
  card.appendChild(triangle)
  card.appendChild(title)
  card.appendChild(timeTitle)
  card.appendChild(moneyTitle)

  historyContainer.appendChild(card);
}

if (!getCurrentUser().history.length > 0) {
  historyContainer.innerText = 'no history'
  historyContainer.style.color = '#ffffff40'
}

getCurrentUser().history.forEach(element => {
  createCard(element.game, element.money, element.time)
});