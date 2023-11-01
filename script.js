const indexContainer = document.querySelector(".index-container");
const backdrop = document.querySelector(".backdrop");
const hiraganaHangulBtn = document.querySelector("#hiragana-hangul-btn");

const BACKDROP_TRANSITION_DELAY = 300;

let completedBackdropAnimation;

const fadeInBackdrop = () => {
  if (backdrop.classList.contains("hidden")) {
    backdrop.className = "backdrop visible";
  }
};

const fadeOutBackdrop = () => {
  if (completedBackdropAnimation) {
    completedBackdropAnimation = false;
    backdrop.className = "backdrop visually-hidden";
    setTimeout(() => {
      backdrop.className = "backdrop hidden";
    }, BACKDROP_TRANSITION_DELAY); // Delay for 300ms to ensure the opacity transition completes
  }
};

hiraganaHangulBtn.addEventListener("click", () => {
  fadeInBackdrop();
});

backdrop.addEventListener("animationend", () => {
  completedBackdropAnimation = true;
});

document.addEventListener("click", (event) => {
  if (event.target === backdrop || !indexContainer.contains(event.target)) {
    fadeOutBackdrop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fadeOutBackdrop();
  }
});
