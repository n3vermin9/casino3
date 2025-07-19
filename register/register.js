import { loginModalAppear } from '../mutualCode.js';

const toggleButton = document.querySelector('.checkbox');
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password');
const btnLogin = document.querySelector('.login-btn');
const loginModal = document.querySelector('.login-modal');

const passwordRules = document.querySelector('.password-rules');
        
let eyeOn = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>`;
let eyeOff = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" /><path d="M3 15l2.5 -3.8" /><path d="M21 14.976l-2.492 -3.776" /><path d="M9 17l.5 -4" /><path d="M15 17l-.5 -4" /></svg>`;
        
toggleButton.innerHTML = eyeOff;
let passwordVisible = false;

window.onload = function() {
  usernameInput.value = ''
  passwordInput.value = ''
}

toggleButton.addEventListener('click', function() {
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? 'text' : 'password';
  toggleButton.innerHTML = passwordVisible ? eyeOn : eyeOff;
});

btnLogin.addEventListener('click', () => {
  if (usernameInput.value === '' || passwordInput.value === '') return;


  if (passwordInput.value) {
    const hasLetter = /[a-zA-Z]/.test(passwordInput.value);
    const hasNumber = /\d/.test(passwordInput.value); 
    if (!(hasLetter)) {
      passwordRules.classList.add('expand')
      passwordRules.innerText = 'password must contain letters'
      return;
    }
    if (!(hasNumber)) {
      passwordRules.classList.add('expand')
      passwordRules.innerText = 'password must contain numbers'
      return;
    }
    if (passwordInput.value.length < 6) {
      passwordRules.classList.add('expand')
      passwordRules.innerText = 'password length must be up to 6 digits'
      return;
    }
  }

  
  let usernameTaken = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`${usernameInput.value}_`)) {
      usernameTaken = true;
      break;
    }
  }
  
  if (usernameTaken) {
    loginModalAppear('This username is already taken');
  } else {
    // Create new account
    const data = {
      nick: usernameInput.value,
      pass: passwordInput.value,
      balance: 0,
      history: [
      ]
    };
    localStorage.setItem(`${data.nick}_${data.pass}`, JSON.stringify(data));
    window.location.href = '../login/login.html';
  }
});


function handleShake(element) {
  element.classList.add('shake-animation');

  setTimeout(() => {
    element.classList.remove('shake-animation');
  }, 500);
}


usernameInput.addEventListener('input', function() {
  if (this.value.length > 13) {
    this.value = this.value.slice(0, 13);
    handleShake(this)
  }
  this.value = this.value.replace(/[^a-zA-Z]/g, '');
});


passwordInput.addEventListener('input', function() {
  if (this.value.length > 13) {
    this.value = this.value.slice(0, 13);
    handleShake(this)
  }
  this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
  passwordRules.classList.remove('expand')
});