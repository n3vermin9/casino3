import {
   updateBalance,
   getBalance,
   setBalance,
   playSound,
   logHistory,
   getCurrentUser,
  } from './mutualCode.js';

const balance = document.querySelector('.balance');


const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');

const gameBlock = document.querySelector('.game-block');
const allBlock = document.querySelector('.all-block');

const wheel = document.querySelector('.wheel')

let isGameOver = false;

let depValue = 0;

function handleModal(result) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerText = result;
  allBlock.appendChild(modal);
}


function handleReset() {
  setTimeout(() => {
      gameBlock.style.opacity = .1;
      // btnStop.style.background = '#333';
      handleInputAppear();
      if (input.value > balance.innerText) {
        input.value = '';
      }
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
  // btnStop.style.display = 'block';
  gameBlock.style.display = 'none';
}
function handleInputAppear() {
  input.style.display = 'block';
  btnDep.style.display = 'block';
  // btnStop.style.display = 'none';
  gameBlock.style.display = 'block';
}

input.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value === '0' && this.value.length === 1 && balance.innerText >= 1) {
      this.value = '1';
  } else if (parseInt(this.value) > parseInt(balance.innerText)) {
      this.value = balance.innerText;
  }
});

let isStarted = false

btnDep.addEventListener('click', (event) => {
    if (input.value && input.value !== '0') {
        isStarted = true
        playSound()
        let current = Math.floor(Math.random() * -345)
        current -= 720
        wheel.style.transform = `rotate(${current}deg)`;
        current += 720
        handleInputHide();
        depValue = parseInt(input.value);
        setBalance(parseInt(getBalance()) - depValue);
        updateBalance();
        
        setTimeout(() => {
            switch (true) {
                case (current <= 14 && current >= -15):
                    handleGameOver('money back');
                    setBalance(parseInt(getBalance()) + depValue);
                    updateBalance();
                    break;

                case (current <= -46 && current >= -75 || current <= -226 && current >= -255):
                    handleGameOver(`you won $${depValue * 2}`);
                    logHistory('Fortune wheel', `+${depValue}`);
                    setBalance(parseInt(getBalance()) + depValue * 2);
                    updateBalance();
                    break;
                    
                case (current <= -105 && current >= -135):
                    handleGameOver(`you won $${depValue * 4}`);
                    logHistory('Fortune wheel', `+${depValue * 3}`);
                    setBalance(parseInt(getBalance()) + depValue * 4);
                    updateBalance();
                    break;  

                case (current <= -165 && current >= -195):
                    handleGameOver(`you won $${depValue * 10}`);
                    logHistory('Fortune wheel', `+${depValue * 9}`);
                    setBalance(parseInt(getBalance()) + depValue * 10);
                    updateBalance();
                    break;

                case (current <= -286 && current >= -315):
                    handleGameOver(`you won $${depValue * 3}`);
                    logHistory('Fortune wheel', `+${depValue * 2}`);
                    setBalance(parseInt(getBalance()) + depValue * 3);
                    updateBalance();
                    break;

                case (current <= -16 && current >= -45 || current <= -76 && current >= -104 || current <= -136 && current >= -164 || current <= -196 && current >= -225 || current <= -256 && current >= -285 || current <= -316 && current >= -345):
                    handleGameOver('you lost');
                    logHistory('Fortune wheel', `-${depValue}`);
                    break; 
            }
            handleReset();
            wheel.style.transform = `rotate(${0}deg)`;
            input.style.visibility = 'visible';
        }, 4000);
    }
});