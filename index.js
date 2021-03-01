const addButton = document.querySelector(".new-card--button");
const newCardForm = document.querySelector(".new-card--form");
const cardsDIV = document.querySelector(".cards");
const nextButton = document.querySelector(".arrows .next");
const prevButton = document.querySelector(".arrows .prev");
const closeFormButton = document.querySelector(".close-form");
const submitButton = document.querySelector("button[type=submit]");
const clearButton = document.querySelector(".clear-button");

// ! Local storage functions
//get cards array from local storage
const getCardsData = () => {
  const cards = JSON.parse(localStorage.getItem("cards"));
  return cards === null ? [] : cards;
};

// add cards array to local storage
const setCardsData = (cards) => {
  localStorage.setItem("cards", JSON.stringify(cards));
};
// ! ------------------------
// cards array
let cards = getCardsData();
// currcard
let currentCard = 1;
// uploaded image
let imageFile = "./images/placeholder.png";

console.log(cards);
// UTILITY FUNCTIONS

// update the slider counter below the cards
const updateSliderCounter = () => {
  const current = document.querySelector(".cards-counter .current");
  const total = document.querySelector(".cards-counter .total");
  current.textContent = currentCard;
  total.textContent = cards.length;
};
// close form
const closeForm = () => {
  newCardForm.classList.add("hidden");
};
// remove all data
const removeAll = (cleanArr = false) => {
  while (cardsDIV.firstChild) {
    const child = cardsDIV.firstChild;
    child.classList.remove("left", "right");
    child.remove();
  }
  if (cleanArr) {
    cards = [];
    currentCard = 0;
    setCardsData(cards);
  }
};

// Rerender list of cards on DOM
const renderCards = () => {
  removeAll();
  cards.forEach((card) => {
    const { id, name, relation, phone, email, website, image } = card;
    const cardElement = document.createElement("div");
    if (id < currentCard) cardElement.classList.add("left");
    if (id > currentCard) cardElement.classList.add("right");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-id", id);
    cardElement.insertAdjacentHTML(
      "beforeend",
      `<div class="card-inner">
      <div class="card-face">
        <div class="profile-image"><img src=${image}></div>
        <div class="about">
            <p class="about--name">${name}</p>
            <p class="about--description">${relation}</p>
        </div>
      </div>
      <div class="card-back">
        <p><span class="highlight">Phone Number:</span> ${phone}</p>
        <p><span class="highlight">Email address:</span> ${email}</p>
        <p><span class="highlight">Website</span>: ${website}</p>
      </div>
    </div>`
    );
    cardsDIV.append(cardElement);
  });
  updateSliderCounter();
};
renderCards();

// create card DOM Element and add it to the cards list
const createCard = () => {
  const id = cards.length + 1;
  const card = {
    id: id,
    name: document.getElementById("name").value,
    relation: document.getElementById("relation").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    website: document.getElementById("website").value,
    image: imageFile,
  };
  cards.push(card);
  currentCard = id;
  setCardsData(cards);

  // );
};

// SLIDER

// left
const slideLeft = () => {
  if (cards.length === 0 || currentCard === 1) return;
  cardsDIV.childNodes.forEach((child) => {
    const { id } = child.dataset;
    if (+id === currentCard - 1) child.classList.remove("left", "right");
    if (+id === currentCard) child.classList.add("right");
  });
  currentCard--;
};

//Right
const slideRight = () => {
  if (cards.length === 0 || currentCard === cards.length) return;
  cardsDIV.childNodes.forEach((child) => {
    const { id } = child.dataset;
    if (+id === currentCard) child.classList.add("left");
    if (+id === currentCard + 1) child.classList.remove("left", "right");
  });
  currentCard++;
};

// EVENT LISTENERS
// submit button
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  createCard();
  renderCards();
  newCardForm.classList.add("hidden");
});

// get image from user
document.getElementById("image").addEventListener("change", function () {
  imageFile = URL.createObjectURL(this.files[0]);
});

// add button
addButton.addEventListener("click", (e) => {
  newCardForm.classList.remove("hidden");
});

// next and prev button
nextButton.addEventListener("click", () => {
  slideRight();
  updateSliderCounter();
});

prevButton.addEventListener("click", () => {
  slideLeft();
  updateSliderCounter();
});

// close form button
closeFormButton.addEventListener("click", () => closeForm());

// clearButton
clearButton.addEventListener("click", () => {
  removeAll(true);
  updateSliderCounter();
});
