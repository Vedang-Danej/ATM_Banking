'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Vedang Danej',
  movements: [2000, 450, -400, 3000, -650, -130, 70, 5300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Shreyansh Dubey',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,
};

const account3 = {
  owner: 'Aditya Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 1111,
};

const account4 = {
  owner: 'Ansh Tomar',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1111,
};
const account5 = {
  owner: 'Sanchay Shrivas',
  movements: [200, -200, 340, -300, -20, 50, 4000, -460],
  interestRate: 1.5,
  pin: 1111,
};
const account6 = {
  owner: 'Chetan Barange',
  movements: [200, -200, 340, -300, -20, 5000, 400, -460],
  interestRate: 1.2,
  pin: 1111,
};
const account7 = {
  owner: 'Yash Sharma',
  movements: [200, -200, 340, -300, -200, 50, 400, -460],
  interestRate: 1.6,
  pin: 1111,
};
const account8 = {
  owner: 'Kunal Mohite',
  movements: [200, -200, 340, -300, -20, 50, 4000, -460],
  interestRate: 1.9,
  pin: 1111,
};
const account9 = {
  owner: 'Sonam Chobey',
  movements: [2000, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 1.4,
  pin: 1111,
};
const account10 = {
  owner: 'Ekta Nayar',
  movements: [200, -200, 3400, -300, -20, 500, 400, -460],
  interestRate: 1.2,
  pin: 1111,
};

const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
  account8,
  account9,
  account10,
];

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
const btnlogout = document.querySelector('.logout-btn');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
document.querySelector('.balance__date').textContent = '';
const displayMovements = function (movements, sort = false) {
  // console.log(containerMovements.innerHTML); //returns the whole content of the html including all the tags
  containerMovements.innerHTML = ''; //this clears the contents of the movements tag
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov.toFixed(2)} ₹</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); //see line 48
    //afterbegin adds elements in the tab that contains movement before already present elements
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (account) {
    account.username = account.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcDisplaySummary = function (account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposits.toFixed(2)} ₹`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} ₹`;
  //the bank gives an interest of 1% on every transaction if that interest is greater than 1 euro

  const interests = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interests.toFixed(2)} ₹`;
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)} ₹`;
};

const displayUI = function (account) {
  //display movements
  document.querySelector('.app').style.opacity = 100;
  displayMovements(account.movements);

  //display balance
  calcDisplayBalance(account);

  //display summary
  calcDisplaySummary(account);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //to prevent page reload when form button is clicked
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    document.querySelector('.incorrect').style.opacity = 0;
    document.querySelector('.instructions').style.opacity = 0;
    //the value returned by input login will always be a string

    //display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }.`;
    inputLoginUsername.value = inputLoginPin.value = '';
    //Display UI
    displayUI(currentAccount);
  } else document.querySelector('.incorrect').style.opacity = 1;
});
btnlogout.addEventListener('click', function () {
  containerApp.style.opacity = 0;
  document.querySelector('.instructions').style.opacity = 1;
  labelWelcome.textContent = 'Log in to get started';
  document.querySelector('.incorrect').style.opacity = 0;
  inputLoginUsername.value = inputLoginPin.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recAccount &&
    recAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recAccount.movements.push(amount);
    displayUI(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(
        account => account.username === currentAccount.username
      ),
      1
    );
    document.querySelector('.app').style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
  document.querySelector('.instructions').style.opacity = 1;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
createUsernames(accounts);

// const balance = movements.reduce(function (acc, mov) {
//   return acc < mov ? mov : acc;
// }, 0);
// const balance = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(balance);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age,
 and stored the data into an array (one array for each). For now,
  they are just interested in knowing whether a dog is an adult or a puppy. 
  A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'),
 and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats,
 not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array
  (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult 
("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const string = 'Steven Williams Thomas McMiller';
// const username = string
//   .toLocaleLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   .join('');
// console.log(username);
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to
 human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'),
 and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, 
humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs
   that are at least 18 years old)
3. Calculate the average human age of all adult dogs
 (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const dogHumanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(dogHumanAges);
//   const dogsAdult = dogHumanAges.filter(humanAge => humanAge >= 18);
//   console.log(dogsAdult);
//   const calcAverageHumanAge = dogsAdult.reduce(
//     (acc, age) => acc + age / dogsAdult.length,
//     0
//   );
//   console.log(calcAverageHumanAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const calcAverageHumanAge = function (ages) {
//   const averageHumanAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   console.log(averageHumanAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const diceRolls = Array.from({ length: 3 }, () =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(...diceRolls);
// console.log('The total number of 1 rolled is: ');
// console.log(diceRolls.filter(roll => roll === 1));
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     mov => Number(mov.textContent.replace(' ₹', ''))
//   );
//   console.log(movementsUI);
// });
///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too 
little.
Eating too much means the dog's current food portion is larger than the recommended portion,
and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% 
below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog,
 calculate the recommended food portion and add it to the object as a new property.
  Do NOT create a new array, simply loop over the array.
   Forumla: recommendedFood = weight ** 0.75 * 28.
   (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little.
 HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array,
  and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch')
 and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: 
"Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended
 (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food
 (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
 (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between
 them 😉
HINT 2: Being within a range 10% above and below the recommended portion means:
 current > (recommended * 0.90) && current < (recommended * 1.10).
  Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];


GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// console.log(dogs);
// dogs.forEach(mov => (mov.recommendedFood = mov.weight ** 0.75 * 28));
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   sarahDog.curFood > sarahDog.recommendedFood
//     ? `Sarah's dog is eating too much`
//     : `Sarah's dog is eating too much`
// );
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle);
// console.log(ownersEatTooMuch);
// console.log(`${ownersEatTooLittle?.join(' and ')}'s dogs eat too little`);
// console.log(`${ownersEatTooMuch?.join(' and ')}'s dogs eat too much`);
// const okayAmountOfFoodCondition = dog =>
//   dog.curFood > dog.recommendedFood * 0.9 &&
//   dog.curFood < dog.recommendedFood * 1.1;
// console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));
// console.log(dogs.some(okayAmountOfFoodCondition));
// const okAmountOfFood = dogs.filter(okayAmountOfFoodCondition);
// console.log(okAmountOfFood);
// const sortDogs = [...dogs];
// sortDogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(sortDogs);
