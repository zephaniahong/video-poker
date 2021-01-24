/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-loop-func */

// DOM Elements
const playingArea = document.createElement('div');
const scoreBoardContainer = document.createElement('div');
const scoreBoardHand = document.createElement('div');
const subPlayingArea = document.createElement('div');
const playingCards = document.createElement('div');
const gameBanner = document.createElement('div');
const button = document.createElement('button');
const reset = document.createElement('button');
const buttonHolder = document.createElement('div');
const hold = document.createElement('div');
const points = document.createElement('div');

playingArea.classList.add('playingArea');
hold.classList.add('hold');
subPlayingArea.classList.add('subPlayingArea');
gameBanner.classList.add('gameBanner');
scoreBoardContainer.classList.add('scoreBoardContainer');
scoreBoardHand.classList.add('scoreBoard', 'hand');
playingCards.classList.add('playingCards');
buttonHolder.classList.add('buttonHolder');
points.classList.add('points');

scoreBoardHand.innerHTML = 'Royal Flush<br>Straight Flush<br>Four of a Kind<br>Full House<br>Flush<br>Straight<br>Three of a Kind<br>Two Pair<br>Jacks or Better<br>';
button.innerText = 'Deal Cards';
reset.innerText = 'Reset';
points.innerText = 100;
gameBanner.innerText = 'Select a scoring system!';

document.body.appendChild(playingArea);
scoreBoardContainer.appendChild(scoreBoardHand);
playingArea.appendChild(scoreBoardContainer);
playingArea.appendChild(subPlayingArea);
subPlayingArea.appendChild(gameBanner);
subPlayingArea.appendChild(hold);
subPlayingArea.appendChild(playingCards);
subPlayingArea.appendChild(buttonHolder);
buttonHolder.appendChild(button);
buttonHolder.appendChild(reset);
subPlayingArea.appendChild(points);

// Globals
const cardShuffle = document.getElementById('cardShuffle');
let deal = 'preGame';
let shuffledDeck = null;
let cardArray = [];
let newArray = ['', '', '', '', ''];
let amtLeft = 100;
let canClick = true;

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

// function to create a card element
const createCardElement = (card) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  const imgSrc = card.img;
  cardElement.innerHTML = `<img src='${imgSrc}' alt='my image'>`;
  playingCards.appendChild(cardElement);
  return cardElement;
};

// counts the number of similar suits in the array
const suitCounter = (cardArray) => {
  const dict = {
    d: 0,
    c: 0,
    h: 0,
    s: 0,
  };
  for (let i = 0; i < cardArray.length; i += 1) {
    if (cardArray[i].suit === '♦') {
      dict.d += 1;
    } else if (cardArray[i].suit === '♣') {
      dict.c += 1;
    } else if (cardArray[i].suit === '♥') {
      dict.h += 1;
    } else if (cardArray[i].suit === '♠') {
      dict.s += 0;
    }
  }
  const maxSuit = Math.max(...Object.values(dict));
  return maxSuit;
};

// special case to check if a card array has 10,J,Q,K,A
const royalStraight = (cardArray) => {
  const valueArray = [];
  const tenToAce = [1, 10, 11, 12, 13];
  for (let i = 0; i < cardArray.length; i += 1) {
    valueArray.push(cardArray[i].value);
  }
  valueArray.sort((a, b) => a - b);
  console.log(valueArray);
  // special case for 10 to A
  let sCounter = 0;
  for (let k = 1; k <= 5; k += 1) {
    if (valueArray.pop() === tenToAce.pop()) {
      sCounter += 1;
    }
  }
  console.log(sCounter);
  if (sCounter === 5) {
    return true;
  }
  return false;
};

// checks if the card array is straight
const isStraight = (cardArray) => {
  const valueArray = [];
  for (let i = 0; i < cardArray.length; i += 1) {
    valueArray.push(cardArray[i].value);
  }
  valueArray.sort((a, b) => a - b);
  // all other straights
  let counter = 0;
  let first = valueArray[0];
  for (let j = 1; j < valueArray.length; j += 1) {
    if (first + 1 === valueArray[j]) {
      counter += 1;
      first = valueArray[j];
    }
  }
  if (counter === 4) {
    return true;
  }
  return false;
};

// counts the number of repeated values in a card array
const ofValue = (cardArray) => {
  const dict = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
  };
  for (let i = 0; i < cardArray.length; i += 1) {
    dict[cardArray[i].value] += 1;
  }
  return dict;
};

// function to find pairs
const pairs = (cardArray) => {
  const dict = ofValue(cardArray);
  let counter = 0;
  for (let i = 1; i <= 13; i += 1) {
    if (dict[i] === 2) {
      counter += 1;
    }
  }
  return counter;
};

let globalScoreList = [];
// function that creates the scoreboard
const createScoreBoard = () => {
  for (let i = 1; i <= 5; i += 1) {
    const scoreList = [1, 2, 3, 4, 6, 9, 25, 50, 250];
    const scoreBoard = document.createElement('div');
    scoreBoard.classList.add('scoreBoard', 'score');
    for (let j = 0; j < scoreList.length; j += 1) {
      scoreList[j] *= i;
    }
    if (i === 5) {
      scoreBoard.innerHTML = `${scoreList[8] * 3.2}<br>${scoreList[7]}<br>${scoreList[6]}</br>${scoreList[5]}<br>${scoreList[4]}<br>${scoreList[3]}<br>${scoreList[2]}<br>${scoreList[1]}<br>${scoreList[0]}`;
      scoreBoard.classList.add('lastBoard');
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
      if (deal === 'preGame' || deal === 'first') {
        gameBanner.innerText = 'Click on Deal Cards to start the game!';
        deal = 'first';
        const element = document.getElementsByClassName('score');
        for (i = 0; i < element.length; i += 1) {
          element[i].style.backgroundColor = '';
        }
        scoreBoard.style.backgroundColor = 'rgba(227, 68, 68, 0.7)';
        return globalScoreList;
      }
      if (deal === 'second') {
        const currMessage = gameBanner.innerText;
        gameBanner.innerText = 'Unable to change score system mid game';
        setTimeout(() => {
          gameBanner.innerText = currMessage;
        }, 1000);
      }
    });
    scoreBoardContainer.appendChild(scoreBoard);
  }
};

// calculates the value of a card array and returns a list [score,'type of hand']
const calcHandScore = (cardArray) => {
  const scoreHand = [];
  // royal flush
  if (royalStraight(cardArray) && suitCounter(cardArray) === 5) {
    scoreHand.push(globalScoreList[8]);
    scoreHand.push('Royal Flush');
  // straight flush
  } else if (suitCounter(cardArray) === 5 && isStraight(cardArray)) {
    scoreHand.push(globalScoreList[7]);
    scoreHand.push('Straight Flush');
  // four of a kind
  } else if (Object.values(ofValue(cardArray)).includes(4)) {
    scoreHand.push(globalScoreList[6]);
    scoreHand.push('Four of a Kind');
    // full house
  } else if (Object.values(ofValue(cardArray)).includes(3) && Object.values(ofValue(cardArray)).includes(2)) {
    scoreHand.push(globalScoreList[5]);
    scoreHand.push('Full House');
    // flush
  } else if (suitCounter(cardArray) === 5) {
    scoreHand.push(globalScoreList[4]);
    scoreHand.push('Flush');
    // straight
  } else if (isStraight(cardArray) || royalStraight(cardArray)) {
    scoreHand.push(globalScoreList[3]);
    scoreHand.push('Straight');
    // 3 of a kind
  } else if (Object.values(ofValue(cardArray)).includes(3)) {
    scoreHand.push(globalScoreList[2]);
    scoreHand.push('3 of a Kind');
    // 2 pairs
  } else if (pairs(cardArray) === 2) {
    scoreHand.push(globalScoreList[1]);
    scoreHand.push('2 Pairs');
    // 1 pair
  } else if (pairs(cardArray) === 1) {
    scoreHand.push(globalScoreList[0]);
    scoreHand.push('1 Pair');
  } else {
    scoreHand.push(0);
    scoreHand.push('Nothing');
  }
  return scoreHand;
};

// function to deal out 5 cards
const dealCards = () => {
  if (deal === 'preGame') {
    error.play();
    gameBanner.innerText = 'SELECT A SCORING SYSTEM!';
  }
  const betAmt = globalScoreList[0];
  if (deal === 'first' && canClick === true) {
    canClick = false;
    playingCards.innerText = '';
    newArray = ['', '', '', '', ''];
    shuffledDeck = shuffleCards(makeDeck());
    hold.innerText = '';
    cardArray = [];
    let card;
    // dedect bet amount
    amtLeft -= betAmt;
    points.innerText = amtLeft;
    cardShuffle.play();
    setTimeout(() => {
      for (let i = 0; i < 5; i += 1) {
      // create hold signs on top of each card
        const holdSign = document.createElement('div');
        holdSign.classList.add('holdSign');
        hold.appendChild(holdSign);
        const newCard = shuffledDeck.pop();
        cardArray.push(newCard);
        card = createCardElement(newCard);
        // adding an event listener for each card to allow the user to hold the card
        card.addEventListener('click', () => {
          if (holdSign.innerText === '') {
            newArray[i] = newCard;
            holdSign.innerText = 'HOLD';
          } else {
            newArray[i] = '';
            holdSign.innerText = '';
          }
        });
      }
      canClick = true;
      deal = 'second';
      const handType = calcHandScore(cardArray)[1];
      gameBanner.innerText = handType;
    }, 1500);
  }
  // dealing cards after player chooses to hold certain cards
  else if (deal === 'second' && canClick === true) {
    canClick = false;
    playingCards.innerText = '';
    let new2Card;
    hold.innerText = '';
    for (let j = 0; j < newArray.length; j += 1) {
      if (newArray[j] === '') {
        new2Card = shuffledDeck.pop();
        newArray[j] = new2Card;
      }
      // create card element
      createCardElement(newArray[j]);
    }
    const pointsWon = calcHandScore(newArray)[0];
    const hand = calcHandScore(newArray)[1];
    if (hand === 'Nothing') {
      losingSound.play();
    } else {
      win.play();
    }
    amtLeft += pointsWon;
    points.innerText = amtLeft;
    gameBanner.innerHTML = `${hand} <br> You won ${pointsWon} points! <br> Click deal cards to play again!`;
    deal = 'first';
    setTimeout(() => {
      playingCards.innerText = '';
      gameBanner.innerText = 'Click deal cards to play again!';
      canClick = true;
    }, 3000);
  }
};

createScoreBoard();
button.addEventListener('click', dealCards);
reset.addEventListener('click', () => {
  globalScoreList = [];
  amtLeft = 100;
  points.innerText = amtLeft;
  playingCards.innerText = '';
  hold.innerText = '';
  canClick = true;
  gameBanner.innerText = 'Select a scoring system!';
  deal = 'preGame';
});
