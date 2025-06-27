import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
} from '../mutualCode.js';

const balance = document.querySelector('.balance');
const navName = document.querySelector('.nav-name')

let btnIncome
let btnGames
let gamesDiv
let gameElem

let incomeState = 0
let isFilterPicked = false

const historyContainer = document.querySelector('.container-history');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May",
  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

let arrowSvg = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408z" /></svg>'
let filterSvg = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" /></svg>'
let gamesSvg = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>'
let closeSvg = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>'


let games = []


getCurrentUser().history.forEach((element) => {
  if (!games.includes(element.game)) {
    games.push(element.game)
  }
});


function displayBtns() {
  btnIncome = document.createElement('div')
  btnIncome.classList.add('display-income')
  btnIncome.innerHTML = filterSvg
  btnIncome.style.color = '#fff'

  btnGames = document.createElement('div')
  btnGames.classList.add('display-games')
  btnGames.innerHTML = gamesSvg
  btnGames.style.color = '#fff'

  gamesDiv = document.createElement('div')
  gamesDiv.classList.add('games-div')

  btnIncome.addEventListener('click', () => {

    incomeState++
    
    if (incomeState == 1) {
      displayHistory(getCurrentUser().history.filter(item => item.money[0] === '+'));
      btnIncome.innerHTML = arrowSvg
      btnIncome.style.color = '#7FFF00'
      btnIncome.style.transform = 'rotate(0deg)'
    } else if (incomeState == 2) {
      displayHistory(getCurrentUser().history.filter(item => item.money[0] === '-'));
      btnIncome.innerHTML = arrowSvg
      btnIncome.style.color = 'red'
      btnIncome.style.transform = 'rotate(180deg)'
    }else {
      btnIncome.style.color = '#7FFF00'
      btnIncome.style.transform = 'rotate(0deg)'
      incomeState = 0
      btnIncome.innerHTML = filterSvg
      displayHistory(getCurrentUser().history);
    }

  });


  btnGames.addEventListener('click', () => {
    if (isFilterPicked) {
      displayHistory(getCurrentUser().history);
      btnGames.innerHTML = gamesSvg
      isFilterPicked = false
    } else {
      gamesDiv.classList.toggle('show');
    }
  });

  games.forEach(elem => {
    gameElem = document.createElement('div')
    gameElem.innerText = elem
    gamesDiv.appendChild(gameElem)

    gameElem.addEventListener('click', () => {
      displayHistory(getCurrentUser().history.filter(item => item.game === elem));
      btnGames.innerHTML = closeSvg
      isFilterPicked = true
    });
  });

  historyContainer.appendChild(btnIncome);
  historyContainer.appendChild(btnGames);
  historyContainer.appendChild(gamesDiv);
}

function createDate(date) {
  const dateTitle = document.createElement('div');
  dateTitle.textContent = date;
  dateTitle.classList.add('date-title');

  historyContainer.appendChild(dateTitle);
}

if (!getCurrentUser().history.length > 0) {
  historyContainer.innerText = 'no history'
  historyContainer.style.color = '#ffffff40'
}


function displayHistory(historyArray) {
  if (getCurrentUser().history == '') {
    console.log(1);
    return
  }
  historyContainer.innerHTML = '';
  displayBtns()
  historyArray.forEach((element, index) => {
    createCard(element.game, element.money, element.time);
    try {
      const [nextTime, nextDate] = historyArray[index + 1].time.split(" ");
      const [nextDay] = nextDate.split("/");
      const [time, date] = element.time.split(" ");
      const [day, month] = date.split("/");
      
      if (day !== nextDay) {
        createDate(`${day} ${monthNames[parseInt(month) - 1]}`);
      }
    } catch (error) {
      const [time, date] = element.time.split(" ");
      const [day, month] = date.split("/");
      createDate(`${day} ${monthNames[parseInt(month) - 1]}`);
    }
  });
}

displayHistory(getCurrentUser().history);