// ------------------- Import Files ---------------------- //

import $ from 'jquery';
import Puzzle from '../src/classes/Puzzle'
import Game from '../src/classes/Game'
import Player from '../src/classes/Player'
import Round from '../src/classes/Round'
import Wheel from '../src/classes/Wheel'
import './css/base.scss';
import './images/WOD-logo.svg';
import './images/w.png';
import './images/star.svg';
import './images/vanna.png';
import './images/pat.png';

// ------------------- Variable Declerations ---------------------- //

const app = document.querySelector('.winners-page');
const playGameBtn = document.getElementById('start-game');
const landingPage = document.getElementById('landing-page');
const instructionsPage = document.querySelector('.instructions');
const gameBoardPage = document.querySelector('.game-page');
const loadGameBtn = document.getElementById('load-game');
const titleLogo = document.querySelector('.logo');
const playerOneNameInput = document.getElementById('first-input');
const playerTwoNameInput = document.getElementById('second-input');
const playerThreeNameInput = document.getElementById('third-input');
const allNames = document.querySelector('.player-names');
const pOneName = document.querySelector('.p-one-name');
const pTwoName = document.querySelector('.p-two-name');
const pThreeName = document.querySelector('.p-three-name');
const patHost = document.querySelector('.pat-host');
const vannaHost = document.querySelector('.vanna-host');
const errorMessage = document.querySelector('.error-message');
const wheelWindow = document.querySelector('.wheel-canvas');
const wheelObject = document.getElementById('canvas');
const spinBtn = document.getElementById('spin-btn');
const puzzleBoard = document.querySelector('.puzzle-board');
const alphabetBtns = document.querySelectorAll('.alphabet-btn');
const puzzleSquares = document.querySelectorAll('.letter');
let player1, player2, player3;
export let currentPlayer;
export let wheel;

// ------------------- Event Listeners ---------------------- //

playGameBtn.addEventListener('click', checkForError);
loadGameBtn.addEventListener('click', showGameBoard);
wheelObject.addEventListener('click', spinWheel);
for (const btn of alphabetBtns) {
  btn.addEventListener('click', evaluateLetter);
}

// ------------------- Functionality ---------------------- //

function takeTurn() {
  if (event.target.id === 'spin-btn') {
    currentPlayer.spinWheel();
  } else if (event.target.id === 'buy-btn') {
    currentPlayer.buyVowel();
  } else if (event.target.id === 'solve-btn') {
    currentPlayer.solvePuzzle();
  }
}

export function getCurrentPlayer(currentPlayerX) {
   currentPlayer = currentPlayerX;
   const playerChoiceBtns = document.querySelector('.turn-choice');
   playerChoiceBtns.addEventListener('click', takeTurn);
}

function checkForError(event) {
  event.preventDefault();
  if (playerOneNameInput.value === '') {
    errorMessage.classList.remove('hidden');
  } else {
    showInstructions();
    playGameBtn.classList.remove('disabled');
  }
}

function saveNames() {
  let firstName = playerOneNameInput.value;
  let secondName = playerTwoNameInput.value;
  let thirdName = playerThreeNameInput.value;

// beginning of game logic
  beginGame(firstName, secondName, thirdName);
  allNames.innerHTML = `${firstName}, ${secondName}, & ${thirdName}`;
  pOneName.innerText = firstName;
  pTwoName.innerText = secondName;
  pThreeName.innerText = thirdName;
}

function showInstructions() {
  saveNames();
  landingPage.classList.add('hidden');
  instructionsPage.classList.remove('hidden');
  patHost.classList.add('slide-top');
}

function showGameBoard(event) {
  event.preventDefault();
  wheel = new Wheel;
  wheel.createWheel();
  titleLogo.classList.add('scale-down-top');
  instructionsPage.classList.add('hidden');
  gameBoardPage.classList.add('fade-in-fwd');
  gameBoardPage.classList.remove('hidden');
  vannaHost.classList.remove('hidden');
  vannaHost.classList.add('slide-in-fwd-right');
  $('#p-1-score').html(`${currentPlayer.roundScore}`);
  $('#p-2-score').html(`${currentPlayer.roundScore}`);
  $('#p-3-score').html(`${currentPlayer.roundScore}`);
  setTimeout(function() {
    showTurnMessage();
  }, 2800);
}

function showTurnMessage() {
  console.log(currentPlayer);
  $('.speech-bubble').removeClass('hidden');
  $('.speech-bubble').html(`
    <p>${currentPlayer.name}'s Turn to Pick</p>
  `);
}

export function showWheel(event) {
  event.preventDefault();
  $('.speech-bubble').addClass('hidden');
  wheelWindow.classList.remove('hidden');
  wheelWindow.classList.remove('slide-out-bottom');
  wheelWindow.classList.add('slide-in-bottom');
  puzzleBoard.classList.add('invisible');
}

function spinWheel(event) {
  event.preventDefault();
  wheelObject.classList.remove('rotate-center');
  wheelObject.classList.add('rotate-center');
  wheel.chooseWheelElement();
  hideWheel(event);
}

function hideWheel(event) {
  event.preventDefault();
  wheelWindow.classList.remove('slide-in-bottom');
  wheelWindow.classList.add('slide-out-bottom');
  setTimeout(function() {
    puzzleBoard.classList.remove('invisible')
  }, 2800);
  setTimeout(function() {
    showMoneyAmount();
  }, 2800);
}

function showMoneyAmount() {
  if (wheel.currentCard !== 'Lose A Turn' && wheel.currentCard !== 'Bankrupt') {
    $('.money-card').html(`
      <p>$${wheel.currentCard}</p>
      `)
  } else {
    $('.money-card').html(`
      <p>${wheel.currentCard}</p>
      `)
  }
}

const myRand = () => {
  let r = 50
  while (40 < r && r < 60) {
    r = Math.random() * 100
  }
  return r
}

for (let i = 0; i < 50; i++) {
  const delay = Math.random() + 's';
  const el = document.createElement('img')
  el.src = './images/star.svg'
  el.className = 'glitter-star'
  el.style.top = myRand() + '%'
  el.style.left = myRand() + '%'
  el.style.animationDelay = delay
  el.style.msAnimationDelay = delay
  el.style.webkitAnimationDelay = delay
  el.style.monAnimationDelay = delay
  app.appendChild(el)
}

// -------------------- Begin Game ----------------------------- //

function beginGame(p1, p2, p3) {
  let game = new Game();
  // instantiate 3 new players
  player1 = new Player(p1, 1);
  player2 = new Player(p2, 2);
  player3 = new Player(p3, 3);
  game.beginRound(player1, player2, player3)
}

// ------------------- Add Puzzle to Game Board -----------------
export function displayPuzzleOnBoard(words) {
  // display first word
  if (words.length === 2) {
    displaySecondWord()

  }
}

// ------------------- evaluate letter -----------------

export function evaluateLetter(event) {
  // if letter is contained within puzzle, display it on the DOM. If not, it is the next players turn.
  let cardCount = 0;
  let letter = event.target;
  puzzleSquares.forEach(square => {
    if (square.innerText === letter.innerHTML) {
      cardCount++;
      square.style.backgroundColor = 'deeppink';
      // vannaHost.classList.add('slide-left');
      setTimeout(function() {
        square.style.backgroundColor = 'white';
        square.style.fontSize = '65px';
      }, 1200);
      // inform player that it's still their turn and update score on DOM

    } else {
      // move currentPlayer to next player and inform that it's their turn
    }
  });
  currentPlayer.calculateScore(cardCount);
  document.querySelectorAll('.consonant-letter').forEach(c => c.classList.add('dead-mouse'));
  letter.classList.add('used-mouse');
  $(`#p-${currentPlayer.playerNumber}-score`).html(`${currentPlayer.roundScore}`);
  setTimeout(function() {
    showTurnMessage();
  }, 1600);
}
