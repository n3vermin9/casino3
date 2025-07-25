import {
   updateBalance,
   getBalance,
   setBalance,
   logHistory,
   getCurrentUser,
   updateUserData,
   redirectUser,
   createDepBtns,
   miniBtnsDiv,
   handleModal,
  } from '../mutualCode.js';

const balance = document.querySelector('.balance');
const input = document.querySelector('.input-dep');
const btnDep = document.querySelector('.btn-dep');
const btnInfo = document.querySelector('.btn-info');

let isGameOver = false;
let depValue = 0;
let animationRunning = false;

redirectUser()

const columns = [
    [document.querySelector('.slots0-0'), document.querySelector('.slots0-1'), document.querySelector('.slots0-2')],
    [document.querySelector('.slots1-0'), document.querySelector('.slots1-1'), document.querySelector('.slots1-2')],
    [document.querySelector('.slots2-0'), document.querySelector('.slots2-1'), document.querySelector('.slots2-2')]
];

const emoArr = [
  '../imgs/frog.png',
  '../imgs/jester.png',
  '../imgs/voodoo.png',
  '../imgs/badPotion.png',
  '../imgs/pepe.png',
  '../imgs/mushroom.png',
  '../imgs/lips.png'
];

const payouts = {
  '../imgs/pepe.png': { multiplier: 100, probability: 0.01 },     // 1% (Jackpot)
  '../imgs/badPotion.png': { multiplier: 50, probability: 0.02 },  // 2% (Rare loss)
  '../imgs/frog.png': { multiplier: 10, probability: 0.08 },       // 8% (Big win)
  '../imgs/mushroom.png': { multiplier: 6, probability: 0.12 },    // 12% (Medium win)
  '../imgs/jester.png': { multiplier: 3, probability: 0.22 },      // 22% (Small win)
  '../imgs/lips.png': { multiplier: 3, probability: 0.22 },        // 22% (Small win)
  '../imgs/voodoo.png': { multiplier: 1, probability: 0.33 },      // 33% (Break-even)
};


let isPayoutInfoActive = false

function showPayoutInfo() {
  btnInfo.style.display = 'none';
  
  const payouts = [
    { image: '../imgs/pepe.png', name: 'Pepe', multiplier: 50, probability: '2%' },
    { image: '../imgs/frog.png', name: 'Frog', multiplier: 6, probability: '10%' },
    { image: '../imgs/mushroom.png', name: 'Mushroom', multiplier: 6, probability: '10%' },
    { image: '../imgs/jester.png', name: 'Jester', multiplier: 3, probability: '30%' },
    { image: '../imgs/lips.png', name: 'Lips', multiplier: 3, probability: '30%' },
    { image: '../imgs/voodoo.png', name: 'Voodoo', multiplier: 1, probability: '60%' },
    { image: '../imgs/badPotion.png', name: 'Bad Poison', multiplier: 0, probability: '30%' }
  ];

  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2000;
    background: #000;
    border-radius: 10px;
    border: 1px solid #333;
    color: white;
    padding: 25px;
    width: 330px;
    max-height: 0;
    visibility: hidden;
    opacity: 0;
    transition: opacity .3s ease, visibility .3s ease, max-height .2s ease;
    overflow-y: auto;
  `;
  if (window.innerWidth > 768) {
    modal.style.width = '550px'
  }


  modal.style.scrollbarWidth = 'none';
  modal.style.msOverflowStyle = 'none';
  const style = document.createElement('style');
  style.innerHTML = `
  #yourDivId::-webkit-scrollbar {
    display: none;
  }
`;

  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Payout Info';
  title.style.cssText = `
    margin-top: 0;
    color: #fff;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    padding-bottom: 10px;
    width: 100%;
  `;

  // Create payout items container
  const itemsContainer = document.createElement('div');
  itemsContainer.style.marginTop = '20px';
  itemsContainer.style.width = '100%';

  // Create each payout item
  payouts.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px;
      background:rgb(0, 0, 0);
      border-radius: 7px;
      border-left: 4px solid rgb(255, 255, 255);
      border: 1px solid #ffffff20;
    `;

    // Create image
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.style.cssText = `
      width: 40px;
      height: 40px;
      margin-right: 15px;
      object-fit: contain;
    `;

    // Create details
    const details = document.createElement('div');
    details.innerHTML = `
      <h4 style="margin: 0 0 5px 0; color:rgb(255, 255, 255);">${item.name}</h4>
      <p style="margin: 2px 0; font-size: 13px;">Payout: x${item.multiplier}</p>
      <p style="margin: 2px 0; font-size: 13px;">Probability: ${item.probability}</p>
    `;

    itemDiv.appendChild(img);
    itemDiv.appendChild(details);
    itemsContainer.appendChild(itemDiv);
  });

  // Assemble modal
  modal.appendChild(title);
  modal.appendChild(itemsContainer);

  // Add to document
  document.body.appendChild(modal);
  
  // Trigger the animation
  setTimeout(() => {
    modal.style.maxHeight = '430px';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
  }, 10);

  isPayoutInfoActive = true;

  // Close when clicking outside
  const clickOutsideHandler = (e) => {
    if (isPayoutInfoActive && !modal.contains(e.target) && e.target !== btnInfo) {
      modal.style.maxHeight = '0';
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
        btnInfo.style.display = 'block';
      }, 300);
      document.removeEventListener('click', clickOutsideHandler);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', clickOutsideHandler);
  }, 10);
}

btnInfo.onclick = showPayoutInfo;

const spinParams = {
    initialSpeed: 200,
    slowdownStart: 100,
    slowdownDuration: 500,
    finalSpeed: 300,
    bounceCount: 2,
    bounceDelay: 50
};

createDepBtns(input, balance)

function getRandomEmoji() {
    const random = Math.random();
    let cumulativeProbability = 0;
    for (const emoji in payouts) {
        cumulativeProbability += payouts[emoji].probability;
        if (random <= cumulativeProbability) {
            return emoji;
        }
    }
    return emoArr[Math.floor(Math.random() * emoArr.length)];
}

function initializeSlots() {
    columns.forEach(column => {
        column.forEach(slot => {
          slot.innerHTML = '';
          slot.style.backgroundImage = `url('${getRandomEmoji()}')`;
          slot.style.backgroundSize = '60%';
          slot.style.backgroundRepeat = 'no-repeat';
          slot.style.backgroundPosition = 'center';
        });
    });
}

let intervalIds = [null, null, null];
let stopSequenceStarted = false;
let currentStoppedColumn = -1;

function animateColumn(column, columnIndex, delay) {
    setTimeout(() => {
        let spinCount = 0;
        let currentSpeed = spinParams.initialSpeed;
        let lastSpinTime = 0;
        let isSlowingDown = false;
        
        const spin = () => {
            const now = Date.now();
            if (now - lastSpinTime < currentSpeed) {
                intervalIds[columnIndex] = requestAnimationFrame(spin);
                return;
            }
            lastSpinTime = now;
            
            // Update the background images instead of innerHTML
            column[0].style.backgroundImage = column[1].style.backgroundImage;
            column[1].style.backgroundImage = column[2].style.backgroundImage;
            column[2].style.backgroundImage = `url('${getRandomEmoji()}')`;
            
            spinCount++;
            
            if (!isSlowingDown && spinCount * currentSpeed > spinParams.slowdownStart) {
                isSlowingDown = true;
                const slowdownStartTime = Date.now();
                
                const slowdown = () => {
                    const elapsed = Date.now() - slowdownStartTime;
                    if (elapsed < spinParams.slowdownDuration) {
                        currentSpeed = spinParams.initialSpeed + 
                            (spinParams.finalSpeed - spinParams.initialSpeed) * 
                            (elapsed / spinParams.slowdownDuration);
                        intervalIds[columnIndex] = requestAnimationFrame(spin);
                    } else {
                        currentSpeed = spinParams.finalSpeed;
                        intervalIds[columnIndex] = requestAnimationFrame(spin);
                    }
                };
                intervalIds[columnIndex] = requestAnimationFrame(slowdown);
                return;
            }
            
            if (!stopSequenceStarted || (stopSequenceStarted && columnIndex > currentStoppedColumn)) {
                intervalIds[columnIndex] = requestAnimationFrame(spin);
            } else {
                let bounceLeft = spinParams.bounceCount;
                const bounce = () => {
                    if (bounceLeft <= 0) return;
                    const bounceHeight = 3 * bounceLeft;
                    column[1].style.transform = `translateY(${bounceHeight}px)`;
                    setTimeout(() => {
                        column[1].style.transform = 'translateY(0)';
                        bounceLeft--;
                        setTimeout(bounce, spinParams.bounceDelay);
                    }, spinParams.bounceDelay);
                };
                bounce();
            }
        };
        intervalIds[columnIndex] = requestAnimationFrame(spin);
    }, delay);
}

function resetAnimationState() {
    intervalIds.forEach(id => cancelAnimationFrame(id));
    intervalIds = [null, null, null];
    stopSequenceStarted = false;
    currentStoppedColumn = -1;
    animationRunning = false;
    columns.forEach(column => {
        column[1].style.transform = '';
    });
}

function handleReset() {
    input.style.display = 'block';
    btnDep.style.display = 'block';
    miniBtnsDiv.classList.toggle('hidden')
      if (parseInt(input.value) > parseInt(balance.innerText)) {
        input.value = '';
      }
    resetAnimationState();
}

input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value === '0' && this.value.length === 1 && balance.innerText >= 1) {
        this.value = '1';
    } else if (parseInt(this.value) > parseInt(balance.innerText)) {
        this.value = balance.innerText;
    }
});

function checkWin() {
  if (animationRunning || currentStoppedColumn < 2) return false;
  
  // Get the background images of the middle row
  const middleRow = [
      columns[0][1].style.backgroundImage,
      columns[1][1].style.backgroundImage,
      columns[2][1].style.backgroundImage
  ].map(bg => {
      // Extract the URL from the background-image property
      const match = bg.match(/url\("?(.*?)"?\)/);
      return match ? match[1] : '';
  });

  if (middleRow[0] && middleRow[1] && middleRow[2] && 
      middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
      const emoji = middleRow[0];
      const payout = payouts[emoji];
      
      if (!payout) {
          console.error("No payout found for:", emoji);
          handleModal('No win this time!');
          return true;
      }

      const multiplier = payout.multiplier || 0;
      const winAmount = depValue * multiplier;
      
      if (winAmount > 0) {
          setBalance(parseInt(getBalance()) + winAmount);
          updateBalance();
          handleModal(`You won ${winAmount}! (${multiplier}x)`);
          logHistory('Tg Slots', `+${winAmount}`)
        } else {
          handleModal('No win this time!');
        }
      return true;
  }
  return false;
}

function handleStart() {
    if (animationRunning) return;
    animationRunning = true;
    resetAnimationState();
    input.style.display = 'none';
    btnDep.style.display = 'none';
    miniBtnsDiv.classList.toggle('hidden')
    
    // Initialize all slots with random emojis
    columns.forEach(column => {
        column[0].style.backgroundImage = `url('${getRandomEmoji()}')`;
        column[1].style.backgroundImage = `url('${getRandomEmoji()}')`;
        column[2].style.backgroundImage = `url('${getRandomEmoji()}')`;
    });
    
    animateColumn(columns[0], 0, 0);
    animateColumn(columns[1], 1, 300);
    animateColumn(columns[2], 2, 600);

    setTimeout(() => {
        stopSequenceStarted = true;
        setTimeout(() => {
            currentStoppedColumn = 0;
            setTimeout(() => {
                currentStoppedColumn = 1;
                setTimeout(() => {
                  currentStoppedColumn = 2;
                  setTimeout(() => {
                      if (!checkWin()) {
                          handleModal('You lost');
                          logHistory('Tg Slots', `-${depValue}`);
                      }
                      setTimeout(handleReset, 1000);
                  }, 300);
              }, 1000); 
            }, 800);
        }, 600);
    }, 1000);
}

initializeSlots();

btnDep.addEventListener('click', (event) => {
    if (input.value && input.value !== '0' && !animationRunning) {
        depValue = parseInt(input.value);
        setBalance(parseInt(getBalance()) - depValue);
        updateBalance();
        handleStart();
    }
});