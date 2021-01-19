// DOM Elements
const playingArea = document.createElement('div');
const scoreBoardContainer = document.createElement('div');
const scoreBoardHand = document.createElement('div');
const playingCards = document.createElement('div');
const button = document.createElement('button');
const hold = document.createElement('div');

playingArea.classList.add('playingArea');
hold.classList.add('hold');

scoreBoardContainer.classList.add('scoreBoardContainer');
scoreBoardHand.classList.add('scoreBoard', 'hand');
playingCards.classList.add('playingCards');

scoreBoardHand.innerHTML = '<ul><li>Royal Flush</li><li>Straight Flush</li><li>Four of a Kind</li><li>Full House</li><li>Flush</li><li>Straight</li><li>Three of a Kind</li><li>Two Pair</li><li>Jacks or Better</li></ul>';
button.innerText = 'Deal Cards';

document.body.appendChild(playingArea);
scoreBoardContainer.appendChild(scoreBoardHand);
playingArea.appendChild(scoreBoardContainer);
playingArea.appendChild(hold);
playingArea.appendChild(playingCards);
playingArea.appendChild(button);

let globalScoreList = null;
// creating elements for each score type
for (let i = 1; i <= 5; i += 1) {
  const scoreList = [1, 2, 3, 4, 6, 9, 25, 50, 250];
  const scoreBoard = document.createElement('div');
  scoreBoard.classList.add('scoreBoard', 'score');
  for (let j = 0; j < scoreList.length; j += 1) {
    scoreList[j] *= i;
  }
  if (i === 5) {
    scoreBoard.innerHTML = `${scoreList[8] * 3.2}<br>${scoreList[7]}<br>${scoreList[6]}</br>${scoreList[5]}<br>${scoreList[4]}<br>${scoreList[3]}<br>${scoreList[2]}<br>${scoreList[1]}<br>${scoreList[0]}`;
  } else {
    scoreBoard.innerHTML = `${scoreList[8]}<br>${scoreList[7]}<br>${scoreList[6]}</br>${scoreList[5]}<br>${scoreList[4]}<br>${scoreList[3]}<br>${scoreList[2]}<br>${scoreList[1]}<br>${scoreList[0]}`;
  }
  // return an array of the score system chosen by the player
  scoreBoard.addEventListener('click', () => {
    if (i === 5) {
      scoreList[8] = 4000;
      globalScoreList = scoreList;
    }
    globalScoreList = scoreList;
    return globalScoreList;
  });
  scoreBoardContainer.appendChild(scoreBoard);
}

// create an array to store all the names of the images
const nums = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
const suitsholder = ['Diamonds', 'Hearts', 'Clubs', 'Spades'];
const imgholder = [];
for (let i = 0; i < 13; i += 1) {
  imgholder.push([]);
  for (let j = 0; j < 4; j += 1) {
    imgholder[i].push(`${nums[i]}of${suitsholder[j]}.jpg`);
  }
}

// creating a deck of cards
const makeDeck = () => {
  const newDeck = [];
  for (let i = 1; i <= 13; i += 1) {
    const suits = ['♦', '♥', '♣', '♠'];
    for (let j = 0; j < suits.length; j += 1) {
      let name = `${i}`;
      if (name === '1') {
        name = 'A';
      } else if (name === '11') {
        name = 'J';
      } else if (name === '12') {
        name = 'Q';
      } else if (name === '13') {
        name = 'K';
      }

      const card = {
        value: i,
        suit: suits[j],
        img: imgholder[i - 1][j],
        name,
      };
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (deck) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < deck.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(deck.length);
    // Select the card that corresponds to randomIndex
    const randomCard = deck[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = deck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    deck[currentIndex] = randomCard;
    deck[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return deck;
};

let firstDeal = true;
let cardArray = [];
const newArray = ['', '', '', '', ''];
const shuffledDeck = shuffleCards(makeDeck());
// function to deal out 5 cards
const dealCards = () => {
  playingCards.innerText = '';
  if (firstDeal === true) {
    cardArray = [];
    for (let i = 0; i < 5; i += 1) {
      // create hold signs on top of each card
      const holdSign = document.createElement('div');
      holdSign.classList.add('holdSign');
      hold.appendChild(holdSign);

      const newCard = shuffledDeck.pop();
      cardArray.push(newCard);
      // create card element
      const card = document.createElement('div');
      card.classList.add('card');
      const imgSrc = newCard.img;
      card.innerHTML = `<img src='${imgSrc}' alt='my image'>`;
      playingCards.appendChild(card);
      card.addEventListener('click', () => {
        newArray[i] = newCard;
        holdSign.innerText = 'HOLD';
      });
    }
    firstDeal = false;
    // dealing cards after player chooses to hold certain cards
  } else if (firstDeal === false) {
    for (let i = 0; i < newArray.length; i += 1) {
      if (newArray[i] === '') {
        const newCard = shuffledDeck.pop();
        newArray[i] = newCard;
      }
      // create card element
      const card = document.createElement('div');
      card.classList.add('card');
      const imgSrc = newArray[i].img;
      card.innerHTML = `<img src='${imgSrc}' alt='my image'>`;
      playingCards.appendChild(card);
    }
  }
};

button.addEventListener('click', dealCards);

// // function to calculate the value of the card array
// const handValue = (cardArray) => {
//   let sum = 0;
//   for (let i = 0; i < cardArray.length; i += 1) {
//     sum += cardArray[i].value;
//   }
//   return sum;
// };

// const calcHandScore = (cardArray) => {
//   // royal flush
//   const sum = 0;
//   const { suit } = cardArray[0];
//   let suitCounter = 0;
//   for (let j = 0; j < cardArray.length; j += 1) {
//     if (cardArray[j].suit === suit) {
//       suitCounter += 1;
//     }
//   }
//   if (handValue(cardArray) === 47 && suitCounter === 5) {
//     console.log('Royal Flush');
//   }
//   return 'tested';
// };

// const royalFlush = [{ value: 1, suit: '♦' }, { value: 10, suit: '♦' }, { value: 11, suit: '♦' }, { value: 12, suit: '♦' }, { value: 13, suit: '♦' }];
