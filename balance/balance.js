import { updateBalance, getBalance, setBalance } from '../mutualCode.js';
let user = JSON.parse(localStorage.getItem('currentUser'));
const balance = document.querySelector('.balance');

const btnAdd = document.querySelectorAll('.btn-add');
const card = document.querySelector('.card');


btnAdd.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    card.classList.toggle('pulse')
    setTimeout(() => {
      card.classList.toggle('pulse')
    }, 100);
    setBalance(parseInt(getBalance()) + parseInt(btn.value))
    updateBalance()
  })
});

balance.addEventListener('click', () => {
  localStorage.setItem('balance', 0)
  updateBalance()
})