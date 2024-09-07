'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];








const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-08-08T14:11:59.604Z',
    '2024-08-13T17:01:17.194Z',
    '2024-08-13T23:36:17.929Z',
    '2024-08-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];








// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// Creating DOM Elements

const formatMovementDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date)
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(value)
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsername = function (accs) {
  accs.forEach(user => {
    user.username = user.owner.toLowerCase().split(" ").map(name => name[0]).join("");
  })
};
createUsername(accounts);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter(interest => interest >= 1).reduce((acc, interest) => acc + interest, 0);

  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}


const updateUI = function (acc) {
  // Display movements 
  displayMovements(acc);

  // Display balance 
  calcDisplayBalance(acc);

  // Display summary 
  calcDisplaySummary(acc);
}

const startLogOutTimer = function () {
  const tick = function () {
    const sec = String(time % 60).padStart(2, 0);
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = "0";
    };

    time--;
  }

  // Set time to 5 minutes
  let time = 10;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

// const now = new Date();
// const min = `${now.getMinutes()}`.padStart(2, 0);
// const hour = `${now.getHours()}`.padStart(2, 0);
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = "1";

    // const now = new Date();
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


    const now = new Date();

    const options = {
      minute: "numeric",
      hour: "numeric",
      day: "numeric",
      // weekday: "long",
      month: "numeric",
      year: "numeric",
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // Timer
    if (timer) clearInterval(timer)
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 && currentAccount.balance >= amount && receverAcc && currentAccount.username !== receverAcc?.username) {
    // Doing transfer
    currentAccount.movements.push(-amount);
    receverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer)
    timer = startLogOutTimer();
  };

  inputTransferTo.value = inputTransferAmount.value = "";
});


btnLoan.addEventListener("click", e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer)
      timer = startLogOutTimer();
    }, 3000);
  }

  inputLoanAmount.value = ""
})


btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  };

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


// const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum)

// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((acc, cur) => cur >= 1000 ? acc + 1 : acc, 0)
// console.log(numDeposits1000)


// const {deposits, withdrawals} = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   sums[cur > 0 ? "deposits" : "withdrawals"] += Math.abs(cur);
//   return sums;
// }, {deposits: 0, withdrawals: 0});
// console.log(deposits, withdrawals);


// const convertTitleCase = function(title){
//   const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];
//   const newTitle = title.toLowerCase().split(" ").map((word, i) => exceptions.includes(word) && i !== 0 ? word : word[0].toUpperCase() + word.slice(1)).join(" ");
//   console.log(newTitle);
// }
// convertTitleCase("this is a NICE title");
// convertTitleCase("aNd hEre is anoThEr tITle witH AN example");


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

// const euroToUsd = 1.1;

// const movementsUsd = movements.map(mov => (mov * euroToUsd).toFixed(2));
// console.log(movementsUsd);

// const movementsUsd2 = [];
// for (const mov of movements) movementsUsd2.push((mov * euroToUsd).toFixed(2));
// console.log(movementsUsd2);

