import { updateBalance, getBalance, setBalance } from './mutualCode.js';
let user = JSON.parse(localStorage.getItem('currentUser'));
const balance = document.querySelector('.balance');

const btnAdd = document.querySelectorAll('.btn-add');


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