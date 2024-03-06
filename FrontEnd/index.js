// Fonctions pour récupérer les données de l'API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error: ", error);
    return null;
  }
};
let works = [];
let categories = [];

const fetchWorks = async () => {
  works = await fetchData("http://localhost:5678/api/works");
  updateGallery();
};

const fetchCategories = async () => {
  categories = await fetchData("http://localhost:5678/api/categories");
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

// Création Bouton et appel gallery//////
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
    imageElement.alt = work.title;
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

// Gestion de la connexion/déconnexion ////////////////
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

////////////         Modale      /////////////////////////
const updateModalGallery = () => {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = ""; // Nettoyer le conteneur avant de le remplir à nouveau

  works.forEach((work) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.style.width = "100%";
    gridItem.appendChild(imageElement);

    // Ajouter l'icône de corbeille
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "delete-icon fa fa-trash";
    deleteIcon.style.position = "absolute";
    deleteIcon.style.top = "5px";
    deleteIcon.style.right = "5px";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.setAttribute("data-id", work.id);
    gridItem.appendChild(deleteIcon);

    // Ajouter un écouteur d'événements pour la suppression sur l'icône de la corbeille
    deleteIcon.addEventListener("click", (e) => {
      e.preventDefault();

      const workId = e.target.getAttribute("data-id");
      supprimerOeuvre(e);
    });

    gridContainer.appendChild(gridItem);
  });
};
function supprimerOeuvre(e) {
  e.preventDefault();
  const workId = e.target.getAttribute("data-id");

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La suppression a échoué");
      }
      // Supprimer visuellement l'œuvre de l'interface utilisateur
      e.target.closest(".grid-item").remove();
      console.log("L'œuvre a été supprimée avec succès.");
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}

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

document.getElementById("editButton").addEventListener("click", openEditModal);
document.querySelector(".close").addEventListener("click", (event) => {
  event.preventDefault();
  closeEditModal();
});

// Fermer la modale si l'utilisateur clique en dehors
window.onclick = (event) => {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    event.preventDefault();
    modal.style.display = "none";
  }
};
// Fonction pour basculer l'affichage entre la galerie et le formulaire d'ajout de photos
const toggleModalContent = () => {
  const modalTitle = document.getElementById("modalTitle");
  const gridContainer = document.querySelector(".grid-container");
  const addPhotoForm = document.getElementById("addPhotoForm");
  const addPhotoButton = document.getElementById("addPhotoButton");
  const backToGalleryIcon = document.getElementById("backToGalleryIcon");

  if (addPhotoForm.style.display === "none") {
    modalTitle.textContent = "Ajout de photo";
    gridContainer.style.display = "none";
    addPhotoForm.style.display = "block";
    addPhotoButton.style.display = "none";
    backToGalleryIcon.style.display = "block";
  } else {
    modalTitle.textContent = "Galerie photo";
    gridContainer.style.display = "grid";
    addPhotoForm.style.display = "none";
    addPhotoButton.style.display = "block";
    backToGalleryIcon.style.display = "none";
    updateModalGallery();
  }
};
const handlePhotoSubmit = async (event) => {
  event.preventDefault();
  console.log("ca marche");
  const formData = new FormData(event.target);
  const errorMessage = document.getElementById("errorMessage");
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    console.error("Auth token not found. Please login first.");
    errorMessage.textContent = "Veuillez vous connecter pour continuer.";
    errorMessage.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    closeEditModal();
    await fetchWorks();
  } catch (error) {
    console.error("Add Work Error: ", error);
    errorMessage.textContent =
      "Erreur lors de l'ajout du travail. Veuillez réessayer.";
    errorMessage.style.display = "block";
  }
};
document
  .getElementById("addPhotoForm")
  .addEventListener("submit", handlePhotoSubmit);

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories();
  populateCategories();
  fetchWorks();
  setupLoginLogout();
  toggleAuthElements();
});

document
  .getElementById("addPhotoButton")
  .addEventListener("click", toggleModalContent);

document.getElementById("backToGalleryIcon").addEventListener("click", () => {
  toggleModalContent();
});

//************ Prévisualisation Photo *********//
document
  .getElementById("photoInput")
  .addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const photoPreview = document.getElementById("photoPreview");
      const newImage = document.createElement("img");
      newImage.src = e.target.result;
      photoPreview.innerHTML = "";
      photoPreview.appendChild(newImage);
    };
    reader.readAsDataURL(event.target.files[0]);
  });

//***********/ Obligation Jpeg et 4mo********* //
document.getElementById("photoInput").addEventListener("change", function () {
  var file = this.files[0];
  if (file.size > 4194304) {
    alert("Le fichier doit être inférieur à 4 Mo.");
    this.value = "";
  } else if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
    alert("Seuls les fichiers JPG et PNG sont autorisés.");
    this.value = "";
  }
});
// Ajoutez les catégories au select du formulaire
const populateCategories = () => {
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchWorks();
  setupLoginLogout();
  toggleAuthElements();
});
