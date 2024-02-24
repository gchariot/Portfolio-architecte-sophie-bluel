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
  filtersContainer.innerHTML = "";

  const allButton = createButton("Tous", () => updateGallery());
  filtersContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = createButton(category.name, () =>
      updateGallery(category.name)
    );
    filtersContainer.appendChild(button);
  });
  // Affiche tous les travaux dès le chargement
  allButton.click();
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

//////         Modale      /////////////////////////
const updateModalGallery = () => {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = ""; // Nettoyer les anciennes images

  works.forEach((work) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.style.width = "100%"; // Assurez-vous que l'image s'adapte à la grille

    gridItem.appendChild(imageElement);
    gridContainer.appendChild(gridItem);
  });
};
// Fonction pour ouvrir la modale
const openEditModal = () => {
  const modal = document.getElementById("editModal");
  modal.style.display = "block";
  updateModalGallery();
};

// Fonction pour fermer la modale
const closeEditModal = () => {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
};

// Ajouter l'événement pour ouvrir la modale
document.getElementById("editButton").addEventListener("click", openEditModal);

// Ajouter l'événement pour fermer la modale
document.querySelector(".close").addEventListener("click", closeEditModal);

// Fermer la modale si l'utilisateur clique en dehors de celle-ci
window.onclick = (event) => {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
