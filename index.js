const addButton = document.querySelector(".new-card--button");
const newCardForm = document.querySelector(".form-slide.contact");
const userForm = document.querySelector(".form-slide.user");
const newContact = document.getElementById("new-contact");
const userAuth = document.getElementById("user-auth");
const cardsDIV = document.querySelector(".cards");
const nextButton = document.querySelector(".arrows .next");
const prevButton = document.querySelector(".arrows .prev");
const closeFormButton = document.querySelector(".close-form");
const clearButton = document.querySelector(".clear-button");
const loginButton = document.querySelector(".login-button");
const signupButton = document.querySelector(".signup-button");

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
const setToken = (token) => {
  localStorage.setItem("token", token);
};
const getToken = () => {
  localStorage.getItem("token");
};
// ! ------------------------

const token = localStorage.getItem("token");
if (token) {
  userForm.classList.add("hidden");
} else userForm.classList.remove("hidden");

// cards array
let cards = getCardsData();
// currcard
let currentCard = cards ? cards.length : 0;
// uploaded image
let imageFile;

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
        <div class="profile-image"><img src=http:localhost:5000/${card.image}></div>
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

// // create card DOM Element and add it to the cards list
// const createCard = () => {
//   const id = cards.length + 1;
//   const card = {
//     id: id,
//     name: document.getElementById("name").value,
//     relation: document.getElementById("relation").value,
//     phone: document.getElementById("phone").value,
//     email: document.getElementById("email").value,
//     website: document.getElementById("website").value,
//     image: imageFile,
//   };
//   cards.push(card);
//   currentCard = id;
//   setCardsData(cards);

//   // );
// };

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
  // getImage();
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
  console.log(data.userName);
};

// ! EVENTS LISTENERS

// HANDLE AUTHENTICATION
let signupRequest;

loginButton.addEventListener("click", () => (signupRequest = false));
signupButton.addEventListener("click", () => (signupRequest = true));

userAuth.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userName = document.getElementById("username").value;

  const userPassword = document.getElementById("password").value;
  const path = signupRequest ? "signup" : "login";
  const response = await fetch(`http://localhost:5000/users/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userPassword }),
  });

  const data = await response.json();
  if (response.status === 200 || response.status === 201) {
    setToken(data.token);
    e.target.submit();
  } else {
    const errorText = e.target.parentNode.querySelector(".error-message");
    errorText.classList.remove("hidden");
    errorText.innerText = `Error: ${data.message}`;
  }
});

// get image from new contact form and store it in a global variable
document.getElementById("contactImage").addEventListener("change", (e) => {
  imageFile = e.target.files[0];
});

// CREATE NEW CONTACT
newContact.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contactName = document.getElementById("contactName").value;
  const contactRelation = document.getElementById("contactRelation").value;
  const contactPhone = document.getElementById("contactPhone").value;
  const contactEmail = document.getElementById("contactEmail").value;
  const contactWebsite = document.getElementById("contactWebsite").value;

  const formData = new FormData();
  formData.append("contactName", contactName);
  formData.append("contactEmail", contactEmail);
  formData.append("contactRelation", contactRelation);
  formData.append("contactPhone", contactPhone);
  formData.append("contactWebsite", contactWebsite);
  formData.append("contactImage", imageFile);

  const response = await fetch("http://localhost:5000/contacts", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log(data);
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

// click on card to turn it
cardsDIV.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  const inner = card.querySelector(".card-inner");
  if (inner.classList.contains("rotate")) inner.classList.remove("rotate");
  else inner.classList.add("rotate");
});
