import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   redirectUser,
   createDepBtns,
   miniBtnsDiv,
   handleModal,
   loginModalAppear,
} from '../mutualCode.js';

const balance = document.querySelector('.balance');

const container = document.querySelector('.container');
const tiles = document.querySelector('.tiles');

const probablyWin = document.querySelector('.probably-win');
const coefDiv = document.querySelector('.coef-div');

const setCountDiv = document.querySelector('.set-count');
const setCountValue = document.querySelector('.set-count-value');
const setMinus = document.querySelector('.set-minus');
const setPlus = document.querySelector('.set-plus');

const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnStop = document.querySelector('.btn-stop');

function handleReset() {
  document.body.classList.remove('block-interactions');
  tiles.classList.add('block-interactions')
  container.style.filter = 'brightness(1)';
  tilesGen()
  handleInputAppear()

  currentCoef = 0
  depValue = 0;
  probablyWin.innerText = ''
  openedTiles = 0
}

let countValue = 3;
let depValue = 0;
let currentCoef = 0;
setCountValue.value = countValue;

let openedTiles = 0

let badSakuraCount

const coefsArr = [1.1, 1.3, 1.6, 2, 2.5,
   3.1,3.8, 4.6, 5.5, 6.5, 7.6, 8.8, 10.1,
   11.5, 13,14.6, 16.3, 18.1, 20, 22, 24.1, 26.2]

tiles.classList.add('block-interactions')

setPlus.addEventListener('click', () => {
  if (countValue < 24) {
    countValue++
    setCountValue.value = countValue
  }
});
setMinus.addEventListener('click', () => {
  if (countValue != 3) {
    countValue--
    setCountValue.value = countValue

  }
});

btnStop.classList.add('hidden')
probablyWin.classList.add('hidden')
coefDiv.classList.add('hidden')

createDepBtns(input, balance)

function createSakura(elem) {
  const lottiePlayer = document.createElement('lottie-player');
  lottiePlayer.classList.add('lottie')

  lottiePlayer.setAttribute('src', '../imgs/sakura.json');
  lottiePlayer.setAttribute('background', 'transparent');
  lottiePlayer.setAttribute('speed', '1');
  lottiePlayer.removeAttribute('loop');
  lottiePlayer.setAttribute('autoplay', '');

  elem.style.border = '1px solid rgb(48, 83, 48)'
  elem.appendChild(lottiePlayer)
}
function createBadSakura(elem) {
  const lottiePlayer = document.createElement('lottie-player');
  lottiePlayer.classList.add('lottie-bad')
  
  lottiePlayer.setAttribute('src', '../imgs/badSakura.json');
  lottiePlayer.setAttribute('background', 'transparent');
  lottiePlayer.setAttribute('speed', '1');
  lottiePlayer.removeAttribute('loop');
  lottiePlayer.setAttribute('autoplay', '');
  lottiePlayer.style.filter = 'grayscale(100%)'
  
  elem.style.border = '1px solid rgb(83, 48, 48)'
  elem.appendChild(lottiePlayer)
}

function tilesGen() {

  tiles.innerHTML = ''
  let matrix = randomMatrix(setCountValue.value)

  for (let index = 0; index < 25; index++) {
    const tile = document.createElement('div')
    tile.classList.add(`tile`, `tile${index}`)
    tiles.appendChild(tile)
    function fillTiles() {
    [...tiles.children].forEach((child, index) => {
      setTimeout(() => {
        if (child.innerHTML !== '') {
          return
        }
        if (matrix[index] == 0) {
          child.style.backgroundImage = "url('../imgs/sakuraImg.png')";
          child.style.border = '1px solid rgb(48, 48, 48)'
        } else {
          child.style.backgroundImage = "url('../imgs/badSakuraImg.png')";
          child.style.border = '1px solid rgb(83, 48, 48)'
          child.style.opacity = 1;
        }
      }, index * 40);
    });
    }

    tile.addEventListener('click', () => {
      let thisTile = tile.classList[1].match(/\d+/g).join('');
      if (tile.innerHTML !== '') {
        return
      }
      if (matrix[thisTile] == 1) {
        createBadSakura(tile)
        document.body.classList.add('block-interactions');
        setTimeout(() => {
          fillTiles()
          setTimeout(() => {
            handleModal('you lost')
            logHistory('Gold Sakura', `-${depValue}`);
            container.style.filter = 'brightness(.3)';
            setTimeout(() => {
              handleReset()
            }, 2000);
          }, 2000);
        }, 1000);
        return
      } else {
        //succesfull click
          probablyWin.innerText = Math.floor(depValue * coefsArr[currentCoef]);
          coefDiv.innerText = `x${coefsArr[currentCoef]}`;
          currentCoef++
          openedTiles++
        createSakura(tile)
      }
      if (currentCoef == 22) {
        handleWin()
      }
    });
  }
}

tilesGen()

function randomMatrix(numOnes) {
  const matrix = Array(5).fill().map(() => Array(5).fill(0));
    let placedOnes = 0;
  while (placedOnes < numOnes) {
    const i = Math.floor(Math.random() * 5);
    const j = Math.floor(Math.random() * 5);
    
    if (matrix[i][j] === 0) {
      matrix[i][j] = 1;
      placedOnes++;
    }
  }
  
  let matrixString = "";
  for (let i = 0; i < 5; i++) {
    matrixString +=matrix[i].join("");
    if (i < 4) matrixString += "";
  }
  
  return matrixString;
}

function handleWin() {
  const winnings = Math.floor(depValue * coefsArr[currentCoef - 1]);
  setBalance(parseInt(balance.innerText) + winnings);
  updateBalance();
  logHistory('Gold Sakura', `+${winnings}`);
  handleModal(`you won $${winnings}`);
  setTimeout(() => {
    handleReset();
  }, 2000);
}

function handleInputHide() {
    input.classList.toggle('hidden')
    btnDep.classList.toggle('hidden')
    btnStop.classList.toggle('hidden')
    miniBtnsDiv.classList.toggle('hidden')
    setCountDiv.classList.toggle('hidden')
    probablyWin.classList.toggle('hidden')
    coefDiv.classList.toggle('hidden')
  }

function handleInputAppear() {
    input.classList.toggle('hidden')
    btnDep.classList.toggle('hidden')
    btnStop.classList.toggle('hidden')
    miniBtnsDiv.classList.toggle('hidden')
    setCountDiv.classList.toggle('hidden')
    probablyWin.classList.toggle('hidden')
    coefDiv.classList.toggle('hidden')
}

btnDep.addEventListener('click', () => {
  if (setCountValue.value < 3) {
    loginModalAppear('Increase the value')
    return
  }
  if (input.value && input.value !== '0') {
    badSakuraCount = setCountValue.value
    currentCoef = badSakuraCount - 3
    tilesGen()
    handleInputHide();
    tiles.classList.remove('block-interactions')
    depValue = parseInt(input.value);
    coefDiv.innerText = `x${coefsArr[currentCoef]}`;

    setBalance(parseInt(getBalance()) - depValue);
    updateBalance();
  }
});

btnStop.addEventListener('click', () => {
  if (openedTiles == 0) {
    loginModalAppear('Make a choice')
  } else {
    handleWin()
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

setCountValue.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value > 24) {
      this.value = 24
      countValue = 24
    }
    countValue = this.value
});