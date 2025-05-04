// balance block

const balance = document.querySelector('.balance');

function setBalance(value) {
    localStorage.setItem('balance', Math.floor(value)); // Store only integers
}

function updateBalance() {
    const balanceValue = localStorage.getItem('balance');
    balance.innerText = parseInt(balanceValue) || 0;
}

function getBalance() {
    return localStorage.getItem('balance');
}

if (!getBalance()) {
    setBalance(0);
    updateBalance();
} else {
    updateBalance();
}

// balance block ----------------------------------------------------


const tales = document.querySelector('.tales');
const tale = document.querySelectorAll('.tale');
const tale0 = document.querySelector('.tale0');
const tale1 = document.querySelector('.tale1');

const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnStop = document.querySelector('.btn-stop');

const gameBlock = document.querySelector('.game-block');
const allBlock = document.querySelector('.all-block');

const probablyWin = document.querySelector('.probably-win');

const coefs = document.querySelector('.coefs');

const btnGuess = document.querySelectorAll('.btn-guess');
const btnHigher = document.querySelector('.btn-higher');
const btnLower = document.querySelector('.btn-lower');

import { spadesArr } from "./spadesData.js";


let isGameOver = false;

let depValue = 0;
let currentCoef = 0;

document.addEventListener('DOMContentLoaded', function() {
    createCoefs(coefsArr);
    probablyWin.style.opacity = 0;
});


let coefsArr = [2, 3.2, 4.9, 6.1, 8, 11.5, 15];

function createCoefs(arr) {
    for (let i = 0; i < arr.length; i++) {
        const coefBlock = document.createElement('div');
        coefBlock.classList.add('coef-block');
        coefBlock.id = `coef${i}`;
        coefBlock.innerText = arr[i];
        coefs.appendChild(coefBlock);
    }
}

function handleModal(result) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerText = result;
    allBlock.appendChild(modal);
}


gameBlock.addEventListener('click', ()=> {
})

function handleReset() {
    setTimeout(() => {
        tale0.style.backgroundImage = "url('/ace_of_spades.svg')";
        gameBlock.style.opacity = .1;
        btnStop.style.background = '#333';
        btnHigher.style.background = '#fff4f4'
        btnLower.style.background = '#fff4f4'
        currentCoef = 0;
        handleInputAppear();
        coefs.innerHTML = '';
        if (input.value > balance.innerText) {
          input.value = '';
        }
        createCoefs(coefsArr);
        probablyWin.style.opacity = 0;
        probablyWin.innerText = 0;
    }, 3000);
}

function handleGameOver(text) {
    allBlock.innerHTML = '';

    allBlock.style.display = 'flex';
    isGameOver = true;

    setTimeout(() => {
        allBlock.style.display = 'none';
        isGameOver = false;
    }, 3000);

    handleModal(text);

}

function handleInputHide() {
    input.style.display = 'none';
    btnDep.style.display = 'none';
    btnStop.style.display = 'block';
    gameBlock.style.display = 'none';
}

function handleInputAppear() {
    input.style.display = 'block';
    btnDep.style.display = 'block';
    btnStop.style.display = 'none';
    gameBlock.style.display = 'block';
}

function getRandomCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

let randomSpade = getRandomCard(spadesArr);
let firstResult = randomSpade.value
console.log(firstResult);

btnDep.addEventListener('click', () => {
    if (input.value && input.value !== '0') {
        handleInputHide();
        depValue = parseInt(input.value);
        probablyWin.style.opacity = 1;
        probablyWin.innerText = 0;

        btnHigher.style.background = '#e2dcdc'
        btnLower.style.background = '#cac4c4'

        setBalance(parseInt(getBalance()) - depValue);
        updateBalance();
        tale0.style.backgroundImage = `url(${randomSpade.img})`
    }
});


btnStop.addEventListener('click', () => {
    if (currentCoef >= 1) {
        const winnings = Math.floor(depValue * coefsArr[currentCoef - 1]);
        setBalance(parseInt(balance.innerText) + winnings);
        updateBalance();
        handleGameOver(`$${winnings}`);
        handleReset();
    }
});

input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value === '0' && this.value.length === 1 && balance.innerText >= 1) {
        this.value = '1';
    } else if (parseInt(this.value) > parseInt(balance.innerText)) {
        this.value = balance.innerText;
    }
});

function handleNextRound() {
  if (currentCoef !== 0) {
      document.getElementById(`coef${currentCoef - 1}`).style.background = '#333';
  }
  if (currentCoef == coefsArr.length) {
      handleGameOver((`$${Math.floor(depValue * 11)}`)); // Display final win as integer
      handleReset();
  }

  let res = document.getElementById(`coef${currentCoef}`);
  if (currentCoef != coefsArr.length) {
      res.style.background = '#888';
      currentCoef++;
      probablyWin.innerText = Math.floor(depValue * coefsArr[currentCoef - 1]); // Display probable win as integer
  }

  if (currentCoef >= 1) {
      btnStop.style.background = '#444';
  }
}

btnGuess.forEach(btn => {
  btn.addEventListener('click', () => {
    let currentGuess = btn.value
    console.log(currentGuess);

    let result = randomSpade.value
    console.log(result);

    btnGuess.forEach(element => {
      element.style.opacity = 0
      gameBlock.style.display = 'block';
    });
    if (btn.value == 'true' && firstResult < result) {
      console.log(33333333);
      handleNextRound()
      setTimeout(() => {
        let randomSpade = getRandomCard(spadesArr);
        let firstResult = randomSpade.value
        tale0.style.backgroundImage = `url(${randomSpade.img})`
      }, 1500);
    }
    if (btn.value == 'false' && firstResult > result) {

    }
  })
});