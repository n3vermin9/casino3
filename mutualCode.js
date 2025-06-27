export function redirectUser() {
  const ALLOWED_PAGES = ['index.html', 'login.html', 'register.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (
    (!getCurrentUser() || getCurrentUser().nick === 'Guest') && 
    !ALLOWED_PAGES.includes(currentPage)
  ) {
    window.location.href = '../index.html';
  }
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : { 
        balance: 0, 
        nick: 'Guest', 
        history: [] 
    };
}

export function updateUserData(updates) {
    const user = getCurrentUser();
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
}

export function setBalance(newBalance) {
    updateUserData({ balance: newBalance });
    updateBalance();
}

export function getBalance() {
    return getCurrentUser().balance;
}

export function updateBalance() {
    const user = getCurrentUser();
    const balanceElement = document.querySelector('.balance');
    const navName = document.querySelector('.nav-name');
    
    if (balanceElement) balanceElement.textContent = user.balance;
    if (navName) navName.textContent = user.nick;
}

export function loginModalAppear(text) {
    const loginModal = document.querySelector('.login-modal');
    if (!loginModal) return;
    
    loginModal.textContent = text;
    loginModal.classList.add('appear');
    
    setTimeout(() => {
        loginModal.classList.remove('appear');
    }, 2000);
}

export function logHistory(gameName, amount) {
    const now = new Date();
    const time = [
        String(now.getHours()).padStart(2, '0'), ':',
        String(now.getMinutes()).padStart(2, '0'), ' ',
        String(now.getDate()).padStart(2, '0'), '/',
        String(now.getMonth() + 1).padStart(2, '0')
    ].join('');

    const currentUser = getCurrentUser();
    const updatedHistory = [
        ...(currentUser.history || []),
        {
            game: gameName,
            money: amount,
            time: time
        }
    ];
    
    updateUserData({ history: updatedHistory });
}

export let miniBtnsDiv

export function createDepBtns(elem1, elem2) {
  miniBtnsDiv = document.createElement('div')
  miniBtnsDiv.classList.add('mini-btns-div')

  let btnDepMin = document.createElement('button')
  btnDepMin.classList.add('mini-btns-dep', 'btn-dep-min')
  btnDepMin.innerText = 'min'
  miniBtnsDiv.appendChild(btnDepMin)

  let btnDepSub = document.createElement('button')
  btnDepSub.classList.add('mini-btns-dep', 'btn-dep-sub')
  btnDepSub.innerText = '/2'
  miniBtnsDiv.appendChild(btnDepSub)
  
  let btnDepMulti = document.createElement('button')
  btnDepMulti.classList.add('mini-btns-dep', 'btn-dep-multi')
  btnDepMulti.innerText = 'x2'
  miniBtnsDiv.appendChild(btnDepMulti)

  let btnDepMax = document.createElement('button')
  btnDepMax.classList.add('mini-btns-dep', 'btn-dep-max')
  btnDepMax.innerText = 'max'
  miniBtnsDiv.appendChild(btnDepMax)

  btnDepMin.addEventListener('click', () => {
    if (elem2.innerText > 0) {
      elem1.value = 1
    }
  });
  
  btnDepSub.addEventListener('click', () => {
    if (elem1.value && elem1.value > 1) {
      elem1.value = parseInt(elem1.value / 2)
    }
  });

  btnDepMulti.addEventListener('click', () => {
    if (elem1.value && parseInt(elem1.value) < parseInt(elem2.innerText)) {
      elem1.value = parseInt(elem1.value * 2)
    }
    if (elem1.value && parseInt(elem1.value) > parseInt(elem2.innerText)) {
      elem1.value = parseInt(elem2.innerText)
    }
  });

  btnDepMax.addEventListener('click', () => {
    if (elem2.innerText > 0) {
      elem1.value = parseInt(elem2.innerText)
    }
  });

  
  const depSection = document.querySelector('.dep-section');
  depSection.appendChild(miniBtnsDiv)
}

export function handleModal(result) {
  document.body.classList.add('modal-active');
  document.body.style.overflow = 'hidden';

  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.textContent = result;
  document.body.appendChild(modal);

  void overlay.offsetWidth;
  void modal.offsetWidth;

  overlay.style.opacity = '1';
  modal.style.opacity = '1';

  setTimeout(() => {
    overlay.style.opacity = '0';
    modal.style.opacity = '0';

    setTimeout(() => {
      overlay.remove();
      modal.remove();
      document.body.style.overflow = '';
      document.body.classList.remove('modal-active');
    }, 200);
  }, 2000);
}

updateBalance()