const btnAdd = document.querySelectorAll('.btn-add');

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





btnAdd.forEach(btn => {
  btn.addEventListener('click', () => {
    setBalance(parseInt(getBalance()) + parseInt(btn.value)) //add to balance some
    updateBalance()
  })
});

balance.addEventListener('click', () => {
  localStorage.setItem('balance', 0)
  updateBalance()
})