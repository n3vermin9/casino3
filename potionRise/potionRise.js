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

const container = document.querySelector('.container');

const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnStop = document.querySelector('.btn-stop');

const tiles = document.querySelector('.tiles');

const probablyWin = document.querySelector('.probably-win');

const coefs = document.querySelector('.coefs');


document.addEventListener('DOMContentLoaded', function() {

});

let coefsArr = [2, 2.6, 4, 5.9, 7.8, 10.4, 14.3];

function createCoefs(arr) {
  for (let i = 0; i < arr.length; i++) {
    const coefBlock = document.createElement('div');
    coefBlock.classList.add('coef-block');
    coefBlock.id = `coef${i}`;
    coefBlock.innerText = arr[i];
    coefs.appendChild(coefBlock);
  }
}

// init codeee

btnStop.classList.add('hidden')
probablyWin.classList.add('hidden')
tiles.classList.add('block-interactions')


let resultPattern
let remainingTiles = 27
let bottomStep = 68
let depValue = 0;
let currentCoef = 0;
let pointerDiv;
let openedTiles = 0

createCoefs(coefsArr);
createDepBtns(input, balance)
tilesGen()

function handleReset() {
  document.body.classList.remove('block-interactions');
  tiles.classList.add('block-interactions')
  container.style.filter = 'brightness(1)';
  coefs.children[openedTiles].style.opacity = '.3'
  probablyWin.innerText = ''
  tiles.innerHTML = ''
  tilesGen()
  handleInputAppear()
  
  resultPattern
  remainingTiles = 27
  bottomStep = 68
  depValue = 0;
  currentCoef = 0;
  pointerDiv;
  openedTiles = 0

  if (parseInt(input.value) > parseInt(balance.innerText)) {
    input.value = ''
  }
}


function generatePattern() {
  const totalLength = 28;
  const segmentSize = 4;
  const segmentsCount = totalLength / segmentSize;
  const segments = [];

  const segmentOptions = [
    ['1', '0', '0', '0'],
    ['1', '1', '0', '0']
  ];

  for (let i = 0; i < segmentsCount; i++) {
    const randInt = Math.floor(Math.random() * segmentOptions.length);
    const selectedSegment = [...segmentOptions[randInt]];
    for (let j = selectedSegment.length - 1; j > 0; j--) {
      const randIndex = Math.floor(Math.random() * (j + 1));
      [selectedSegment[j], selectedSegment[randIndex]] = [selectedSegment[randIndex], selectedSegment[j]];
    }
    segments.push(selectedSegment.join(''));
  }

  resultPattern = segments.join('');
  return resultPattern;
}

function tilesGen() {
  for (let i = 0; i < 28; i++) {
    let tile = document.createElement('div')
    tile.classList.add('tile')
    tile.id = i
    tiles.appendChild(tile)


    tile.addEventListener('click', (event) => {
      if (event.target.id < remainingTiles - 3 ||
        event.target.id > remainingTiles
      ) return;
      if (resultPattern[event.target.id] == 0) {
        event.target
      }

      if (resultPattern[i] == 1) {
        tile.style.backgroundImage = "url('../imgs/badPotion.png')";
        tile.style.border = '1px solid rgba(102, 40, 40, 1)'
        tile.style.backgroundSize = '90%'
        document.body.classList.add('block-interactions');
        setTimeout(() => {
          fillTiles()
          setTimeout(() => {
            handleModal('You lost')
            logHistory('Potion Rise', `-${depValue}`);
            container.style.filter = 'brightness(.3)';
            setTimeout(() => {
              handleReset()
            }, 2000);
          }, 2000);
        }, 1000);
        return
      }
      if (resultPattern[i] == 0) {
      tile.style.backgroundImage = "url('../imgs/potion.png')";
      tile.style.border = '1px solid rgb(48, 83, 48)'
      tile.style.backgroundSize = '70%'
      openedTiles++
      coefs.children[openedTiles].style.opacity = '1'
      coefs.children[openedTiles - 1].style.opacity = '.3'
      probablyWin.innerText = Math.floor(depValue * coefsArr[currentCoef]);
      currentCoef++
    } else {
      
    }
      movePointer()
    });
  }

  pointerDiv = document.createElement('div')
  pointerDiv.classList.add('pointer-div')
  tiles.appendChild(pointerDiv)
}

function movePointer(event) {
  if (remainingTiles == 3) return;
  for (let i = 0; i < 4; i++) {
    remainingTiles--
  }
  pointerDiv.style.transform  = `translateY(-${bottomStep}px)`
  bottomStep += 68
}




function fillTiles() {
[...tiles.children].forEach((child, index) => {
  setTimeout(() => {
    if (child.innerHTML !== '' || child.classList.contains('pointer-div')) {
      return
    }
    if (resultPattern[index] == 0) {
      child.style.backgroundImage = "url('../imgs/potion.png')";
      child.style.backgroundSize = '70%'
    } else {
      child.style.backgroundImage = "url('../imgs/badPotion.png')";

      child.style.backgroundSize = '90%'
      child.style.opacity = 1;
    }
  }, index * 40);
});
}


function handleWin() {
  const winnings = Math.floor(depValue * coefsArr[currentCoef-1]);
  setBalance(parseInt(balance.innerText) + winnings);
  updateBalance();
  logHistory('Potion Rise', `+${winnings}`);
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
    probablyWin.classList.toggle('hidden')
  }

function handleInputAppear() {
    input.classList.toggle('hidden')
    btnDep.classList.toggle('hidden')
    btnStop.classList.toggle('hidden')
    miniBtnsDiv.classList.toggle('hidden')
    probablyWin.classList.toggle('hidden')
}

btnDep.addEventListener('click', () => {
  if (input.value && input.value !== '0') {

    generatePattern()
    handleInputHide();
    tiles.classList.remove('block-interactions')
    coefs.children[openedTiles].style.opacity = '1'
    depValue = parseInt(input.value);

    probablyWin.innerText = depValue
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