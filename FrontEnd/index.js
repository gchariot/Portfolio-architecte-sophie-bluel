let works = [];
let categories = [];

const fetchWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (works = data));

  console.log(works);
};

const fetchCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      categories = data;
      createFilterButtons();
    });

  console.log(categories);
};

const createFilterButtons = () => {
  const filtersContainer = document.querySelector(".filters");

  // Afficher toutes les catégories
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => updateGallery());
  filtersContainer.appendChild(allButton);

  // Crée un bouton pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => updateGallery(category.name));
    filtersContainer.appendChild(button);
  });

  fetchWorks();
};

const updateGallery = (filter = null) => {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    if (!filter || article.category.name === filter) {
      const worksElement = document.createElement("figure");

      const imageElement = document.createElement("img");
      imageElement.src = article.imageUrl;

      const nomElement = document.createElement("figcaption");
      nomElement.textContent = article.title;

      galleryContainer.appendChild(worksElement);
      worksElement.appendChild(imageElement);
      worksElement.appendChild(nomElement);
    }
  }
};
fetchCategories();
