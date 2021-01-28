const playBtn = document.querySelector("#play-btn");
const introModal = document.querySelector("#intro-modal");
const difficultyModal = document.querySelector("#difficulty-modal");

playBtn.addEventListener("click", function () {
  introModal.style.display = "none";
  difficultyModal.style.display = "flex";
});


