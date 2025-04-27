// balance block

const balance = document.querySelector('.balance');




function setBalance(value) {
  localStorage.setItem('balance', value)
}

function updateBalance() {
  const balanceValue = localStorage.getItem('balance');
  balance.innerText = parseInt(balanceValue) || 0;
}

function getBalance() {
  return localStorage.getItem('balance')
}


if (!getBalance()) {
  setBalance(0)
  updateBalance()
}else {
  updateBalance()
}

// balance block

