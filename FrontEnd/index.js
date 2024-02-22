// Fonctions pour récupérer les données de l'API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error: ", error);
  }
};

const fetchWorks = async () => {
  works = await fetchData("http://localhost:5678/api/works");
  console.log(works);
  updateGallery();
};

const fetchCategories = async () => {
  categories = await fetchData("http://localhost:5678/api/categories");
  console.log(categories);
  createFilterButtons();
};

// Fonctions pour mettre à jour le DOM
const createFilterButtons = () => {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = ""; // Reset pour éviter les duplications

  const allButton = createButton("Tous", () => updateGallery());
  filtersContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = createButton(category.name, () =>
      updateGallery(category.name)
    );
    filtersContainer.appendChild(button);
  });

  allButton.click(); // Affiche tous les travaux dès le chargement
};

const createButton = (text, clickHandler) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", clickHandler);
  return button;
};

const updateGallery = (filter = null) => {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  const filteredWorks = filter
    ? works.filter((work) => work.category.name === filter)
    : works;

  filteredWorks.forEach((work) => {
    const worksElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const captionElement = document.createElement("figcaption");
    captionElement.textContent = work.title;

    worksElement.appendChild(imageElement);
    worksElement.appendChild(captionElement);
    galleryContainer.appendChild(worksElement);
  });
};

// Gestion de l'affichage en fonction de l'état de connexion
const toggleAuthElements = () => {
  const authToken = localStorage.getItem("authToken");
  const authMessage = document.getElementById("authSuccessMessage");
  const editButton = document.getElementById("editButton");
  const filterButtons = document.querySelector(".filters");

  authMessage.style.display = authToken ? "flex" : "none";
  editButton.style.display = authToken ? "block" : "none";
  filterButtons.style.display = authToken ? "none" : "flex";
};

// Gestion de la connexion/déconnexion
const setupLoginLogout = () => {
  const loginLogoutLink = document.getElementById("loginLogoutLink");
  if (localStorage.getItem("authToken")) {
    loginLogoutLink.textContent = "logout";
    loginLogoutLink.href = "#";
    loginLogoutLink.onclick = () => {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    };
  } else {
    loginLogoutLink.textContent = "login";
    loginLogoutLink.href = "login.html";
  }
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchWorks();
  setupLoginLogout();
  toggleAuthElements();
});
