import { updateBalance, getBalance, setBalance } from './mutualCode.js';
const btnAdd = document.querySelectorAll('.btn-add');

let user = JSON.parse(localStorage.getItem('currentUser'));
const balance = document.querySelector('.balance');

btnAdd.forEach(btn => {
  btn.addEventListener('click', () => {
    setBalance(parseInt(getBalance()) + parseInt(btn.value))
    updateBalance()
  })
});

balance.addEventListener('click', () => {
  localStorage.setItem('balance', 0)
  updateBalance()
})