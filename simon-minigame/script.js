"use strict";

const modalContainer = document.querySelector(".modal-container");
const closeModalBtn = document.querySelector(".close-modal-btn");

const gridContainer = document.querySelector(".grid-container");
const currentLevel = document.querySelector(".current-lvl");
const playerHealth = document.querySelector(".player-health");

const firstLife = document.querySelector(".first-life");
const secondLife = document.querySelector(".second-life");
const thirdLife = document.querySelector(".third-life");

const firstGameBtn = document.querySelector(".first-game-btn");
const secondGameBtn = document.querySelector(".second-game-btn");
const thirdGameBtn = document.querySelector(".third-game-btn");
const fourthGameBtn = document.querySelector(".fourth-game-btn");

const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");

const mediaQuery = window.matchMedia("(min-width: 576px)");

const firstGameBtnSFX = new Audio("audio/mp3_Red-btn.mp3");
const secondGameBtnSFX = new Audio("audio/mp3_Blue-btn.mp3");
const thirdGameBtnSFX = new Audio("audio/mp3_Green-btn.mp3");
const fourthGameBtnSFX = new Audio("audio/mp3_Yellow-btn.mp3");
const btnHoverSFX = new Audio("audio/wav_Button-hover.wav");
const startLevelSFX = new Audio("audio/wav_Start-level.wav");
const levelCompletedSFX = new Audio("audio/wav_Level-completed.wav");
const wrongPatternSFX = new Audio("audio/mp3_Wrong-pattern.mp3");
const gameOverSFX = new Audio("audio/mp3_Game-over.mp3");

firstGameBtnSFX.volume = 0.2;
secondGameBtnSFX.volume = 0.1;
thirdGameBtnSFX.volume = 0.1;
fourthGameBtnSFX.volume = 0.2;
btnHoverSFX.volume = 0.1;
startLevelSFX.volume = 0.3;
levelCompletedSFX.volume = 0.3;
wrongPatternSFX.volume = 0.4;
gameOverSFX.volume = 0.1;

const lives = [firstLife, secondLife, thirdLife];
const gameButtons = [firstGameBtn, secondGameBtn, thirdGameBtn, fourthGameBtn];
const gameButtonsSFX = [firstGameBtnSFX, secondGameBtnSFX, thirdGameBtnSFX, fourthGameBtnSFX];
const menuButtons = [startBtn, restartBtn];

let playerLives = 3;
let level = 1;
let gamePattern = [];
let gamePatternSFX = [];
let playerPattern = [];
let shownPattern = false;

// ! "Game Loop"

let startGame = () => {
  startLevelSFX.play();
  gridContainer.classList.add("active-pattern");
  currentLevel.classList.add("invisible");
  playerHealth.classList.add("invisible");
  let randomNumber = Math.floor(Math.random() * 4);
  gamePattern.push(gameButtons[randomNumber]);
  gamePatternSFX.push(gameButtonsSFX[randomNumber]);
  console.log(gamePattern);
  setTimeout(() => {
    showPattern();
  }, 1000);
};

let showPattern = (i = 0) => {
  if (i >= gamePattern.length) {
    playerPattern = [];
    shownPattern = true;
    gridContainer.classList.remove("active-pattern");
    return;
  }

  playSound(gamePatternSFX[i]);
  gamePattern[i].classList.add(`${gamePattern[i].className}-pattern`);
  setTimeout(() => {
    gamePattern[i].classList.remove(`${gamePattern[i].className.split(" ")[1]}`);
    setTimeout(() => {
      showPattern(i + 1);
    }, 300);
  }, 300);
};

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// let showPattern = async () => {
//   for (let i = 0; i < gamePattern.length; i++) {
//     playSound(gamePatternSFX[i]);
//     gamePattern[i].classList.add(`${gamePattern[i].className}-pattern`);
//     setTimeout(() => {
//       gamePattern[i].classList.remove(`${gamePattern[i].className.split(" ")[1]}`);
//     }, 300);
//     await delay(500);
//   }

//   playerPattern = [];
//   shownPattern = true;
//   gridContainer.classList.remove("active-pattern");
//   return;
// };

let comparePatterns = (gamePattern, playerPattern) => {
  for (let i = 0; i < playerPattern.length; i++) {
    if (gamePattern[i] !== playerPattern[i]) {
      return false;
    }
  }
  return true;
};

let checkPlayerPattern = () => {
  if (!shownPattern) return;

  if (!comparePatterns(gamePattern, playerPattern)) {
    handleIncorrectPattern();
    return;
  }

  if (playerPattern.length >= gamePattern.length) {
    handleCorrectPattern();
  }
};

let handleCorrectPattern = () => {
  shownPattern = false;
  levelCompletedSFX.play();
  currentLevel.textContent = `Level - ${++level}`;
  currentLevel.classList.remove("invisible");
  playerHealth.classList.remove("invisible");
  startBtn.removeAttribute("disabled");
  startBtn.setAttribute("tabindex", "0");
  startBtn.classList.remove("invisible");
  startBtn.classList.remove("disabled-btn-cursor");
};

let handleIncorrectPattern = () => {
  disableGameButtons();
  playerPattern = [];
  playerHealth.classList.remove("invisible");
  animateContainer();

  if (playerLives === 3) {
    playerLives = 2;
    wrongPatternSFX.play();
    thirdLife.src = "images/img_Broken-heart.png";
  } else if (playerLives === 2) {
    playerLives = 1;
    wrongPatternSFX.play();
    secondLife.src = "images/img_Broken-heart.png";
    animateHealth(true);
  } else if (playerLives === 1) {
    shownPattern = false;
    gameOverSFX.play();
    firstLife.src = "images/img_Broken-heart.png";
    animateHealth(false);
    showGameOverScreen();
  }
};

let showGameOverScreen = () => {
  playerLives = 3;
  level = 1;
  gamePattern = [];
  gamePatternSFX = [];
  currentLevel.textContent = "Game Over!";
  currentLevel.classList.remove("invisible");
  startBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
  restartBtn.removeAttribute("disabled");
  restartBtn.setAttribute("tabindex", "0");
  restartBtn.classList.remove("disabled-btn-cursor");
  setTimeout(() => {
    restartBtn.classList.remove("invisible");
  }, 50);
};

// ! Miscellaneous

let playSound = (SFX) => {
  SFX.pause();
  SFX.currentTime = 0;
  SFX.play();
};

let disableGameButtons = () => {
  gameButtons.forEach((btn) => btn.setAttribute("disabled", true));
  gridContainer.classList.add("incorrect-pattern");
  setTimeout(() => {
    gameButtons.forEach((btn) => btn.removeAttribute("disabled"));
    gridContainer.classList.remove("incorrect-pattern");
  }, 1000);
};

let animateContainer = () => {
  gridContainer.classList.add("shake-animation");
  setTimeout(() => {
    gridContainer.classList.remove("shake-animation");
  }, 150);
};

let animateHealth = (flag) => {
  if (flag) {
    firstLife.classList.add("wave-animation");
    setTimeout(() => {
      secondLife.classList.add("wave-animation");
    }, 100);
    setTimeout(() => {
      thirdLife.classList.add("wave-animation");
    }, 200);
  } else {
    lives.forEach((life) => life.classList.remove("wave-animation"));
  }
};

// ! Button Functionality

let playAudioAndCheckPattern = (audio, button) => {
  playSound(audio);
  playerPattern.push(button);
  checkPlayerPattern();
};

gameButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    playAudioAndCheckPattern(gameButtonsSFX[index], button);
  });
});

let handleMenuButton = (button) => {
  button.setAttribute("disabled", true);
  button.setAttribute("tabindex", "-1");
  button.classList.add("disabled-btn-cursor");
  button.classList.add("invisible");
  startGame();
};

startBtn.addEventListener("click", () => {
  handleMenuButton(startBtn);

  if (!startBtn.classList.contains("start-btn-clicked")) {
    setTimeout(() => {
      startBtn.classList.add("start-btn-clicked");
      startBtn.textContent = "Continue";
    }, 250);
  }
});

restartBtn.addEventListener("click", () => {
  handleMenuButton(restartBtn);
  setTimeout(() => {
    restartBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
    lives.forEach((life) => (life.src = "images/img_Heart.png"));
  }, 250);
});

let handleButtonHover = () => playSound(btnHoverSFX);

if (mediaQuery.matches) {
  menuButtons.forEach((button) => {
    button.addEventListener("mouseenter", handleButtonHover);
  });
}

// ! Modal Fade-out Effect

let modalFadeOut = () => {
  modalContainer.classList.add("invisible");
  setTimeout(() => {
    modalContainer.classList.add("hidden");
  }, 500);
};

closeModalBtn.addEventListener("click", modalFadeOut);

window.addEventListener("click", (event) => {
  if (event.target === modalContainer) {
    modalFadeOut();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalFadeOut();
  }
});
