import { updateBalance, getBalance, setBalance, playSound } from './mutualCode.js';
let user = JSON.parse(localStorage.getItem('currentUser'));
const balance = document.querySelector('.balance');


const ghost = document.querySelector('.ghost');
const greenLine = document.querySelector('.green-line');
const coefDiv = document.querySelector('.coef-div');
const verticalRuler = document.querySelector('.vertical-ruler');

const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnStop = document.querySelector('.btn-stop');

const allBlock = document.querySelector('.all-block');


let isGameOver = false;
let depValue = 0;
let winnings = 0;
let coefValue = 1;
let rulerInterval;
let coefInterval;
let ghostInterval;
let currentPosition = 0;
const maxHeight = 300;
const ghostSpeed = .4;
const baseCrashChance = 0.003;
let hasCrashed = false;
let stopClicked = false;
let rulerHeight = 400;

function handleModal(result) {
setTimeout(() => {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerText = result;
      allBlock.appendChild(modal);
}, 500);
}

function handleReset() {
    setTimeout(() => {
        btnStop.style.background = '#333';
        handleInputAppear();

        currentPosition = 0;
        ghost.style.bottom = '0px';
        ghost.style.backgroundImage = 'url("/ghostWin.png")';
        ghost.style.transform = 'rotate(0deg)';
        greenLine.style.height = '0px';
        coefDiv.style.bottom = '0px';
        coefDiv.innerText = 'x1.00';
        coefDiv.style.color = 'white';
        coefValue = 1;
        greenLine.classList.remove('lost');
        rulerHeight = 400;
        verticalRuler.style.height = rulerHeight + '%'
        ghost.classList.add('ghost-standing')
        coefDiv.classList.add('ghost-standing')
        clearInterval(coefInterval);
        clearInterval(ghostInterval);
        hasCrashed = false;
        stopClicked = false;
        if (parseInt(input.value) > parseInt(balance.innerText)) {
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
    btnStop.style.display = 'block';
}

function handleInputAppear() {
    input.style.display = 'block';
    btnDep.style.display = 'block';
    btnStop.style.display = 'none';
}

function calculateWinOrLose() {
    // Always pay out when stop was clicked (before crash)
    if (stopClicked) {
        winnings = Math.floor(depValue * coefValue);
        setBalance(parseInt(balance.innerText) + winnings);
        updateBalance();
        handleGhostWin();
        return `win $${winnings}`;
    }
    
    // If we got here, it must be a crash
    handleGhostLost();
    return `lost $${depValue}`;
}

function handleGhostLost() {
    ghost.style.backgroundImage = 'url("/ghostLost.png")';
    ghost.style.transform = 'rotate(0deg)';
    greenLine.classList.add('lost');
    coefDiv.style.color = 'red';
}

function handleGhostWin() {
    ghost.style.backgroundImage = 'url("/ghostWin.png")';
    ghost.style.transform = 'rotate(0deg)';
}

function checkRandomCrash() {
    const currentCrashChance = baseCrashChance * (1 + (currentPosition / maxHeight) * 4);
    return Math.random() < currentCrashChance;
}

function updateGhostPosition() {
    // Check for random crash
    if (checkRandomCrash() && !stopClicked) {
        hasCrashed = true;
        clearInterval(rulerInterval)
        clearInterval(ghostInterval);
        clearInterval(coefInterval);
        handleGhostLost();
        handleGameOver(`lost $${depValue}`);
        handleReset();
        return;
    }
    
    currentPosition += ghostSpeed;

    if (currentPosition >= maxHeight) {
        currentPosition = maxHeight;
        clearInterval(rulerInterval)
        clearInterval(ghostInterval);
        clearInterval(coefInterval);
        const result = calculateWinOrLose();
        handleGameOver(result);
        handleReset();
        return;
    }
    
    ghost.style.bottom = currentPosition + 'px';
    greenLine.style.height = currentPosition + 'px';
    coefDiv.style.bottom = currentPosition + 'px';
    coefValue = 1 + (currentPosition / maxHeight) * 9;
    const formattedValue = coefValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    coefDiv.innerText = `x${formattedValue}`;   
    verticalRuler.style.height = rulerHeight + '%'
    rulerHeight -= .5
}

function startGhostRise() {
    handleInputHide();
    playSound()
    ghost.style.backgroundImage = 'url("/ghost.png")';
    ghost.style.transform = 'rotate(-90deg)';
    ghost.classList.remove('ghost-standing')
    coefDiv.classList.remove('ghost-standing')
    coefDiv.style.color = '#82ff2f';
    depValue = parseInt(input.value);

    setBalance(parseInt(getBalance()) - depValue);
    updateBalance();
    ghostInterval = setInterval(updateGhostPosition, 16);
}

btnDep.addEventListener('click', () => {
    if (input.value && input.value !== '0') {
        startGhostRise();
    }
});

btnStop.addEventListener('click', () => {
    if (ghostInterval && !hasCrashed) {
        stopClicked = true;
        clearInterval(ghostInterval);
        clearInterval(coefInterval);
        const result = calculateWinOrLose();
        handleGameOver(result);
        handleReset();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (btnDep.style.display !== 'none' && input.value && input.value !== '0') {
            startGhostRise();
        }
        else if (btnStop.style.display !== 'none' && ghostInterval && !hasCrashed) {
            stopClicked = true;
            clearInterval(ghostInterval);
            clearInterval(coefInterval);
            const result = calculateWinOrLose();
            handleGameOver(result);
            handleReset();
        }
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

ghost.addEventListener('click', startGhostRise);

function createSubRuler() {
  for (let i = 0; i < 15; i++) {
  let subRuler = document.createElement('div')
  subRuler.classList.add('sub-ruler')
  verticalRuler.appendChild(subRuler)  
  }
}

createSubRuler()