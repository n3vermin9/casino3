import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   createDepBtns,
   miniBtnsDiv,
   handleModal,
  } from '../mutualCode.js';

const balance = document.querySelector('.balance');


const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');

const wheel = document.querySelector('.wheel')

let isGameOver = false;

let depValue = 0;

createDepBtns(input, balance)


function handleReset() {
  setTimeout(() => {
      // btnStop.style.background = '#333';
      handleInputAppear();
      if (parseInt(input.value) > parseInt(balance.innerText)) {
        input.value = '';
      }
  }, 2300);
}

function handleInputHide() {
  input.style.display = 'none';
  btnDep.style.display = 'none';
  // btnStop.style.display = 'block';
  miniBtnsDiv.classList.toggle('hidden')
}
function handleInputAppear() {
  input.style.display = 'block';
  btnDep.style.display = 'block';
  // btnStop.style.display = 'none';
  miniBtnsDiv.classList.toggle('hidden')
}

input.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value === '0' && this.value.length === 1 && balance.innerText >= 1) {
      this.value = '1';
  } else if (parseInt(this.value) > parseInt(balance.innerText)) {
      this.value = balance.innerText;
  }
});

function wheelCase(multi, logMulti, balanceMulti) {
  handleModal(`you won $${depValue * multi}`);
  logHistory('Fortune wheel', `+${depValue * logMulti}`);
  setBalance(parseInt(getBalance()) + depValue * balanceMulti);
  updateBalance();                    
}

let isStarted = false

btnDep.addEventListener('click', (event) => {
  if (input.value && input.value !== '0') {

    isStarted = true
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
          handleModal('money back');
          setBalance(parseInt(getBalance()) + depValue);
          updateBalance();
          break;

        case (current <= -46 && current >= -75 || current <= -226 && current >= -255):
          wheelCase(2, 1, 2)
          break;
            
        case (current <= -105 && current >= -135):
          wheelCase(4, 3, 4)
          break;  

        case (current <= -165 && current >= -195):
          wheelCase(10, 9, 10)
          break;

        case (current <= -286 && current >= -315):
          wheelCase(3, 2, 3)
          break;

        case (current <= -16 && current >= -45 || current <= -76 && current >= -104 || current <= -136 && current >= -164 || current <= -196 && current >= -225 || current <= -256 && current >= -285 || current <= -316 && current >= -345):
          handleModal('You lost');
          logHistory('Fortune wheel', `-${depValue}`);
          break; 
      }
        handleReset();
        wheel.style.transform = `rotate(${0}deg)`;
        input.style.visibility = 'visible';
    }, 4000);
  }
});