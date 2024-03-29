const loadingOverlay = document.querySelector(".loading");
const addButton = document.querySelector(".new-card--button");
const newCardForm = document.querySelector(".form-slide.contact");
const userForm = document.querySelector(".form-slide.user");
const newContact = document.getElementById("new-contact");
const userAuth = document.getElementById("user-auth");
const cardsDIV = document.querySelector(".cards");
const nextButton = document.querySelector(".arrows .next");
const prevButton = document.querySelector(".arrows .prev");
const closeFormButton = document.querySelector(".close-form");
const signupButton = document.querySelector(".signup-button");
const loginButton = document.querySelector(".login-button");
const logoutButton = document.querySelector(".logout-button");

// ! Local storage functions
//get cards array from local storage
const getCardsData = () => {
  return JSON.parse(localStorage.getItem("cards"));
};

// add cards array to local storage
const setCardsData = (cards) => {
  if (!cards) cards = [];
  localStorage.setItem("cards", JSON.stringify(cards));
};
const setToken = (token) => {
  localStorage.setItem("token", token);
};
const getToken = () => {
  return localStorage.getItem("token");
};

// ! ------------------------

const token = getToken();
if (token) userForm.classList.add("hidden");
else userForm.classList.remove("hidden");

// cards array
let cards = getCardsData();
// currcard
let currentCard = cards ? cards.length : 0;
// uploaded image
let imageFile;

// UTILITY FUNCTIONS

//display loading overlay
const isLoading = (loading) => {
  if (loading) loadingOverlay.classList.remove("hide");
  else loadingOverlay.classList.add("hide");
};

// display error
const displayError = (target, message) => {
  const errorText = target.parentNode.querySelector(".error-message");
  errorText.classList.remove("hidden");
  errorText.innerText = `Error: ${message}`;
};

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
  cards.forEach((card, index) => {
    const position = index + 1;
    const {
      _id: id,
      contactName,
      contactRelation,
      contactPhone,
      contactEmail,
      contactWebsite,
      contactImage,
    } = card;
    const cardElement = document.createElement("div");
    if (position < currentCard) cardElement.classList.add("left");
    if (position > currentCard) cardElement.classList.add("right");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-position", position);
    cardElement.insertAdjacentHTML(
      "beforeend",
      `<div class="card-inner">
      <div class="card-face">
        <div class="profile-image"><img src=https://cards-contacts.herokuapp.com/${contactImage}></div>
        <div class="about">
            <p class="about--name">${contactName}</p>
            <p class="about--description">${contactRelation}</p>
            <i class="delete-card fas fa-times" data-id=${id}></i>
        </div>
      </div>
      <div class="card-back">
        <p><span class="highlight">Phone Number:</span> ${contactPhone}</p>
        <p><span class="highlight">Email address:</span> ${contactEmail}</p>
        <p><span class="highlight">Website</span>: ${contactWebsite}</p>
      </div>
    </div>`
    );
    cardsDIV.append(cardElement);
  });
  updateSliderCounter();
};
if (cards) renderCards(cards);

// SLIDER
// left
const slideLeft = () => {
  if (cards.length === 0 || currentCard === 1) return;
  cardsDIV.childNodes.forEach((child) => {
    const { position } = child.dataset;
    if (+position === currentCard - 1) child.classList.remove("left", "right");
    if (+position === currentCard) child.classList.add("right");
  });
  currentCard--;
};

//Right
const slideRight = () => {
  if (cards.length === 0 || currentCard === cards.length) return;
  cardsDIV.childNodes.forEach((child) => {
    const { position } = child.dataset;
    if (+position === currentCard) child.classList.add("left");
    if (+position === currentCard + 1) child.classList.remove("left", "right");
  });
  currentCard++;
};

// ! EVENTS LISTENERS

// HANDLE AUTHENTICATION
let signupRequest;

loginButton.addEventListener("click", () => (signupRequest = false));
signupButton.addEventListener("click", () => (signupRequest = true));

// Login or singup the user and gets user data (token)
userAuth.addEventListener("submit", async (e) => {
  isLoading(true);
  e.preventDefault();
  const userName = document.getElementById("username").value;

  const userPassword = document.getElementById("password").value;
  const path = signupRequest ? "signup" : "login";

  let userResponse;
  try {
    userResponse = await fetch(`https://cards-contacts.herokuapp.com/users/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, userPassword }),
    });
  } catch (err) {
    displayError(e.target, "Something went wrong. Please try again later");
    return isLoading(false);
  }
  const userData = await userResponse.json();

  // Get user contacts from the server
  let contactsData;
  if (userResponse.status === 200 || userResponse.status === 201) {
    setToken(userData.token);
    try {
      const contactsResponse = await fetch("https://cards-contacts.herokuapp.com/contacts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      contactsData = await contactsResponse.json();
    } catch (err) {
      displayError(e.target, userData.message);
      return isLoading(false);
    }

    setCardsData(contactsData.contacts);
    isLoading(false);
    e.target.submit();
  } else {
    displayError(e.target, userData.message);
    isLoading(false);
  }
});

// CREATE NEW CONTACT
newContact.addEventListener("submit", async (e) => {
  isLoading(true);
  e.preventDefault();

  const token = getToken();
  if (!token) {
    displayError(e.target, "Something went wrong. Pleaset try again later");
    return isLoading(false);
  }

  const contactName = document.getElementById("contactName").value;
  const contactRelation = document.getElementById("contactRelation").value;
  const contactPhone = document.getElementById("contactPhone").value;
  const contactEmail = document.getElementById("contactEmail").value;
  const contactWebsite = document.getElementById("contactWebsite").value;
  const imageFile = document.getElementById("contactImage").files[0];

  const formData = new FormData();
  formData.append("contactName", contactName);
  formData.append("contactEmail", contactEmail);
  formData.append("contactRelation", contactRelation);
  formData.append("contactPhone", contactPhone);
  formData.append("contactWebsite", contactWebsite);
  formData.append("contactImage", imageFile);

  let response;
  try {
    response = await fetch("https://cards-contacts.herokuapp.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (err) {
    displayError(e.target, "Something went wrong, try again later");
    return isLoading(false);
  }
  const data = await response.json();

  if (response.status === 200 || response.status === 201) {
    const position = cards.length + 1;
    cards.push(data.contact);
    setCardsData(cards);
    currentCard = position;
    newCardForm.classList.add("hidden");
    e.target.submit();
  } else {
    displayError(e.target, data.message);
  }
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

//logout
logoutButton.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  localStorage.removeItem("cards");
  userForm.classList.remove("hidden");
});

// listen for click event on card (to turn or delete it)
cardsDIV.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-card")) {
    isLoading(true);
    const token = getToken();
    contactId = e.target.dataset.id;
    fetch("https://cards-contacts.herokuapp.com/contacts/" + contactId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw "Something went wrong";
        return response.json();
      })
      .then((response) => {
        isLoading(false);
        if (currentCard === cards.length) currentCard--;
        cards = cards.filter((card) => card._id !== contactId);
        setCardsData(cards);
        renderCards();
      })
      .catch((err) => {
        return isLoading(false);
      });
  } else {
    const card = e.target.closest(".card");
    const inner = card.querySelector(".card-inner");
    if (inner.classList.contains("rotate")) inner.classList.remove("rotate");
    else inner.classList.add("rotate");
  }
});
