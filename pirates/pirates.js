import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   loginModalAppear,
   createDepBtns,
   miniBtnsDiv,
   handleModal,
  } from '../mutualCode.js';

const balance = document.querySelector('.balance');


const tales = document.querySelector('.tales');
const tale = document.querySelectorAll('.tale');
const tale0 = document.querySelector('.tale0');
const tale1 = document.querySelector('.tale1');

const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnStop = document.querySelector('.btn-stop');

const probablyWin = document.querySelector('.probably-win');

const coefs = document.querySelector('.coefs');


let isGameOver = false;

let depValue = 0;
let currentCoef = 0;


document.addEventListener('DOMContentLoaded', function() {
    createCoefs(coefsArr);
    probablyWin.style.opacity = 0;
});

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

createDepBtns(input, balance)


function handleReset() {
    setTimeout(() => {
        tale0.style.backgroundImage = "url('../imgs/closedChest.png')";
        tale1.style.backgroundImage = "url('../imgs/closedChest.png')";
        currentCoef = 0;
        handleInputAppear();
        coefs.innerHTML = '';
      if (parseInt(input.value) > parseInt(balance.innerText)) {
        input.value = '';
      }
        createCoefs(coefsArr);
        probablyWin.style.opacity = 0;
        probablyWin.innerText = 0;
    }, 2000);
}

btnStop.classList.add('hidden')
tales.classList.add('block-interactions')

function handleInputHide() {
    input.classList.toggle('hidden')
    btnDep.classList.toggle('hidden')
    btnStop.classList.toggle('hidden')
    tales.classList.remove('block-interactions')
    miniBtnsDiv.classList.toggle('hidden')
  }

function handleInputAppear() {
    input.classList.toggle('hidden')
    btnDep.classList.toggle('hidden')
    btnStop.classList.toggle('hidden')
    tales.classList.add('block-interactions')
    miniBtnsDiv.classList.toggle('hidden')
}

btnDep.addEventListener('click', () => {
    if (input.value && input.value !== '0') {
        handleInputHide();
        depValue = parseInt(input.value); // Ensure depValue is an integer
        probablyWin.style.opacity = 1;
        probablyWin.innerText = 0;

        setBalance(parseInt(getBalance()) - depValue); // Subtract integer value
        updateBalance();
    }
});
btnStop.addEventListener('click', () => {
  if (currentCoef == 0) {
      loginModalAppear('Make a choice')
      }
    if (currentCoef >= 1) {
        const winnings = Math.floor(depValue * coefsArr[currentCoef - 1]); // Calculate winnings as integer
        setBalance(parseInt(balance.innerText) + winnings); // Add integer winnings
        updateBalance();
        logHistory('Tg Slots', `+${winnings}`);
        handleModal(`you won $${winnings}`);
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
        handleModal((`you won $${Math.floor(depValue * 11)}`));
        const winnings = Math.floor(depValue * 11);
        setBalance(parseInt(balance.innerText) + winnings);
        updateBalance();
        logHistory('Tg Slots', `+${depValue * 11}`);
        handleReset();
    }

    let res = document.getElementById(`coef${currentCoef}`);
    if (currentCoef != coefsArr.length) {
        res.style.background = '#888';
        currentCoef++;
        probablyWin.innerText = Math.floor(depValue * coefsArr[currentCoef - 1]);
    }

    tale.forEach(tale => {
        tales.classList.add('block-interactions')
        tale.style.transform = 'translateY(200px)';

        setTimeout(() => {
            tale.style.opacity = 0;
        }, 1000);

        setTimeout(() => {
            tale.style.transform = 'translateY(-600px)';
            tale.style.border = '1px solid #00000030';
            tale0.style.backgroundImage = "url('../imgs/closedChest.png')";
            tale1.style.backgroundImage = "url('../imgs/closedChest.png')";
        }, 1000);


        setTimeout(() => {
            tale.style.opacity = 1;
        }, 1100);

        setTimeout(() => {
            tale.style.transform = 'translateY(0px)';
            tales.classList.remove('block-interactions')
        }, 1100);

    });
}

tale.forEach(tale => {
    tale.addEventListener('click',  () => {
        if ((Math.floor(Math.random() < .4))) { // <------ .4 = 40% to lose

            tale0.style.backgroundImage = "url('../imgs/goldChest.png')";
            tale1.style.backgroundImage = "url('../imgs/goldChest.png')";
            tale.style.backgroundImage = "url('../imgs/emptyChest.png')";
            logHistory('Pirates', `-${depValue}`);
            handleModal('you lost');
            handleReset();
        }else{
            tale0.style.backgroundImage = "url('../imgs/emptyChest.png')";
            tale1.style.backgroundImage = "url('../imgs/emptyChest.png')";
            tale.style.backgroundImage = "url('../imgs/goldChest.png')";
            tale.style.border = '1px solid #00000090'
            handleNextRound();
        }
    });
});