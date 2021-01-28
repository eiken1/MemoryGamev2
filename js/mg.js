//Create variables/references to various dom elements
const mainContainer = document.querySelector("#main");
const modalContainer = document.querySelector(".modal-container");

//Variables that are needed throughout the file
const animalArr = ["cat", "crow", "dove", "dragon", "hippo", "frog", "horse", "spider"];
let difficultyMode = "";
let tryCounter = 0;
let openedCards = [];
let usedIcons = [];
let difficultyArr = [];
let cardList = [];

//Function that sets up the game board and removes cards based on the difficulty
function setupBoard(difficulty) {
  modalContainer.style.display = "none";
  mainContainer.style.display = "flex";

  startGame(difficulty);
}

function addGameClickListeners(e) {
  const card = e.currentTarget;
  const shouldAddIcon = !findCardObject(card).animalType;
  if (card && shouldAddIcon && card.classList.contains("card")) { 
    addIcon(card);
  } 
  openCard(card);
  checkIfGameIsOver();
}

function canAddAnimalToCard(animalIcon) {
  return usedIcons.filter((icon) => icon === animalIcon).length != 2;
}

function findCardObject (cardElement) {
  return cardList.find((card) => `card-${card.id}` === cardElement.id);
} 

function createIcon(card, animal){
  let iconElement = document.createElement("i");
  iconElement.setAttribute("class", "fas fa-" + animal);
  card.appendChild(iconElement);
  let currentCard = findCardObject(card);
  currentCard.animalType = animal;
  usedIcons.push(animal);  
}

function getRandomAnimal() {
  return difficultyArr[Math.floor(Math.random() * difficultyArr.length)];
}

function iconsStillNeedsToBeAdded() {
  return usedIcons.length !== difficultyArr.length * 2;
}

function addIcon(card) {
  const animal = getRandomAnimal();
  if (canAddAnimalToCard(animal)) {
    createIcon(card, animal);
  } else {
    if (iconsStillNeedsToBeAdded()) {
      addIcon(card);
    }
  }
}

function setupDifficultyButtons(){
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");
  //Event listeners for various buttons
  difficultyBtns.forEach((btn) => { 
    btn.addEventListener("click", function () {
      const congratsModal = document.querySelector(".congratulations-modal");
      modalContainer.style.display = "flex";
      congratsModal.style.display = "none";
      mainContainer.style.display = "none";
      removeCardsFromGame();
    });
  })


  const easyBtn = document.querySelector("#easy-diff");
  easyBtn.addEventListener("click", function () {
    setupBoard("easy");
  });
  
  const mediumBtn = document.querySelector("#medium-diff");
  mediumBtn.addEventListener("click", function () {
    setupBoard("medium");
  });

  const hardBtn = document.querySelector("#hard-diff");
  hardBtn.addEventListener("click", function () {
    setupBoard("hard");
  });

  const closeModal = document.querySelector("#close-modal");
  closeModal.addEventListener("click", function () {
    const congratsModal = document.querySelector(".congratulations-modal");
    congratsModal.style.display = "none";
  });
}

setupDifficultyButtons();


function getDifficultySize(difficulty) {
  switch (difficulty) {
    case "easy":
      return animalArr.length - 4;
    case "medium":
      return animalArr.length - 2;
    case "hard":
    default:
      return animalArr.length;
  }
}

function startGame(difficulty) {
  const tries = document.querySelector("#tries");
  tryCounter = 0;
  tries.textContent = 0;

  difficultyMode = difficulty;
  openedCards = [];
  usedIcons = [];
  cardList = [];
  
  const difficultySize = getDifficultySize(difficulty);
  difficultyArr = animalArr.slice(0, difficultySize);
  for (let i = 0; i < difficultySize * 2; i++) {
    createCard(i);
  }
}

function removeCardsFromGame() {
  const cardContainer = document.querySelector("#card-container");
  cardContainer.textContent = "";
}

function createCard(index) {
  let newCard = document.createElement("li");
  newCard.setAttribute("class", "card unflipped");
  newCard.setAttribute("id", `card-${index}`);
  newCard.addEventListener("click", (e) => {
    addGameClickListeners(e);
  });
  cardList.push({
    id: index,
    animalType: undefined,
    faceUp: false,
    toggle: toggleCardFlip = (card) => {
      card.faceUp = !card.faceUp;
    },
    matched: false
  })
  const cardContainer = document.querySelector("#card-container");
  cardContainer.appendChild(newCard);
}


//Function to keep track of cards clicked/tries
function increaseTryCount() {
  tryCounter++;
  tries.textContent = tryCounter;
}

function disableAllCards () {
  let allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    card.style.pointerEvents = "none";
    setTimeout(() => {
      card.style.pointerEvents = "auto";
    }, 1100);
  })
}


//Function that runs when cards are clicked and checks if it matches or if it doesn't
function openCard(card) {
  card.classList.add("disabled");
  card.classList.remove("unflipped");
  openedCards.push(card);
  if (openedCards.length === 2) {
    let openedCard1 = findCardObject(openedCards[0]);
    let openedCard2 = findCardObject(openedCards[1]);
    increaseTryCount();
    if (openedCard1.animalType === openedCard2.animalType) {
      openedCard1.matched = true;
      openedCard2.matched = true;
      cardsMatched();
    } else {
      cardsDidNotMatch();
      disableAllCards();
    }
  }
}

function resetOpenedCards() {
  openedCards = [];
}

//Function that runs when cards are matched. It
//adds the match class to matched cards and
//removes the standard card classes
function cardsMatched() {
  openedCards.forEach(card => {
    card.classList.add("match");
    card.classList.remove("unflipped");
  })
  resetOpenedCards();
}

//Function that runs when cards don't match. It adds the
//the unmatchec to the cards, and removes it after
//a short delay of 1.1 sec
function cardsDidNotMatch() {
  openedCards.forEach(card => { 
    card.classList.add("unmatched", "disabled");
  })

  setTimeout(() => {
    openedCards.forEach(card => { 
      card.classList.remove("unmatched", "disabled");
      card.classList.add("unflipped");
    })
    resetOpenedCards();
  }, 1100);
}

//Function to check if the current game has finished and
//if it has, it displays a congratulation modal and gives the
//user a short summary and the option to start a new game/select different difficulty
function checkIfGameIsOver() {
  if (difficultyMode) {
    const congratsMsg = document.querySelector("#congratulations-message");
    const congratsModal = document.querySelector(".congratulations-modal");
    const matchedCardArr = [];

    cardList.forEach(card => {
      if (card.matched) {
        matchedCardArr.push(card);
      }
    })

     if (difficultyMode === "easy" && matchedCardArr.length === 8) {
      congratsModal.style.display = "flex";
      congratsMsg.textContent = "Congratulations! You completed the Memory Game on Easy difficulty in " + tryCounter + " tries!";
    } else if (difficultyMode === "medium" && matchedCardArr.length === 12) {
      congratsModal.style.display = "flex";
      congratsMsg.textContent = "Congratulations! You completed the Memory Game on Medium difficulty in " + tryCounter + " tries!";
    } else if (difficultyMode === "hard" && matchedCardArr.length === 16) {
      congratsModal.style.display = "flex";
      congratsMsg.textContent = "Congratulations! You completed the Memory Game on Hard difficulty in " + tryCounter + " tries!";
    }
  } else {
    console.log("difficulty mode is not set");
  }
}