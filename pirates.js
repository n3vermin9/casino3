import {
   updateBalance,
   getBalance,
   setBalance,
   playSound,
   logHistory,
   getCurrentUser,
   loginModalAppear,
  } from './mutualCode.js';

const balance = document.querySelector('.balance');


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


let isGameOver = false;

let depValue = 0;
let currentCoef = 0;


document.addEventListener('DOMContentLoaded', function() {
    createCoefs(coefsArr);
    probablyWin.style.opacity = 0;
});

input.focus()

let coefsArr = [1.5, 2, 3.1, 4.5, 6, 8, 11];

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


function handleReset() {
    setTimeout(() => {
        tale0.style.backgroundImage = "url('imgs/closedChest.png')";
        tale1.style.backgroundImage = "url('imgs/closedChest.png')";
        gameBlock.style.opacity = .1;
        currentCoef = 0;
        handleInputAppear();
        coefs.innerHTML = '';
        if (input.value > balance.innerText) {
          input.value = '';
        }
        createCoefs(coefsArr);
        probablyWin.style.opacity = 0;
        probablyWin.innerText = 0;
        input.focus()
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

btnDep.addEventListener('click', () => {
    if (input.value && input.value !== '0') {
        handleInputHide();
        playSound()
        depValue = parseInt(input.value); // Ensure depValue is an integer
        probablyWin.style.opacity = 1;
        probablyWin.innerText = 0;

        setBalance(parseInt(getBalance()) - depValue); // Subtract integer value
        updateBalance();
    }
});
btnStop.addEventListener('click', () => {
  if (currentCoef == 0) {
      loginModalAppear('Pick between two')
      }
    if (currentCoef >= 1) {
        const winnings = Math.floor(depValue * coefsArr[currentCoef - 1]); // Calculate winnings as integer
        setBalance(parseInt(balance.innerText) + winnings); // Add integer winnings
        updateBalance();
        logHistory('Slots', `+${winnings}`);
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
        handleGameOver((`$${Math.floor(depValue * 11)}`));
        const winnings = Math.floor(depValue * 11);
        setBalance(parseInt(balance.innerText) + winnings);
        updateBalance();
        logHistory('Slots', `+${depValue * 11}`);
        handleReset();
    }

    let res = document.getElementById(`coef${currentCoef}`);
    if (currentCoef != coefsArr.length) {
        res.style.background = '#888';
        currentCoef++;
        probablyWin.innerText = Math.floor(depValue * coefsArr[currentCoef - 1]); // Display probable win as integer
    }

    tale.forEach(tale => {
        gameBlock.style.display = 'block';
        tale.style.transform = 'translateY(200px)';

        setTimeout(() => {
            tale.style.opacity = 0;
        }, 1000);

        setTimeout(() => {
            tale.style.transform = 'translateY(-600px)';
            tale0.style.backgroundImage = "url('imgs/closedChest.png')";
            tale1.style.backgroundImage = "url('imgs/closedChest.png')";
        }, 1000);


        setTimeout(() => {
            tale.style.opacity = 1;
        }, 1100);

        setTimeout(() => {
            tale.style.transform = 'translateY(0px)';
            gameBlock.style.display = 'none';
        }, 1100);

    });
}

tale.forEach(tale => {
    tale.addEventListener('click',  () => {
        if ((Math.floor(Math.random() < .4))) { // <------ .4 = 40% to lose

            tale0.style.backgroundImage = "url('imgs/goldChest.png')";
            tale1.style.backgroundImage = "url('imgs/goldChest.png')";
            tale.style.backgroundImage = "url('imgs/emptyChest.png')";
            logHistory('Pirates', `-${depValue}`);
            handleGameOver('you lost');
            handleReset();
        }else{
            tale0.style.backgroundImage = "url('imgs/emptyChest.png')";
            tale1.style.backgroundImage = "url('imgs/emptyChest.png')";
            tale.style.backgroundImage = "url('imgs/goldChest.png')";
            handleNextRound();
        }
    });
});