let works = [];
let categories = [];

const fetchWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      works = data;
    });

  console.log(works);
  updateGallery();
};

const fetchCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      categories = data;
    });

  console.log(categories);
  createFilterButtons();
};

const createFilterButtons = () => {
  const filtersContainer = document.querySelector(".filters");

  // Crée et ajoute le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => updateGallery());
  filtersContainer.appendChild(allButton);

  // Crée un bouton pour chaque catégorie dans les données récupérées
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => updateGallery(category.name));
    filtersContainer.appendChild(button);
  });

  // Simule un clic sur le bouton "Tous" pour afficher tous les travaux dès le chargement
  allButton.click();
  fetchWorks();
};

const updateGallery = (filter = null) => {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  works.forEach((work) => {
    if (!filter || work.category.name === filter) {
      const worksElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      const captionElement = document.createElement("figcaption");
      captionElement.textContent = work.title;

      worksElement.appendChild(imageElement);
      worksElement.appendChild(captionElement);
      galleryContainer.appendChild(worksElement);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
});
