let works = [];

const fetchGallery = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      works = data;

      // Créer les éléments HTML à l'intérieur de la fonction
      for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const sectionGallery = document.querySelector(".gallery");
        const worksElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;

        const nomElement = document.createElement("figcaption");
        nomElement.textContent = article.title;

        sectionGallery.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(nomElement);
      }
    });

  console.log(works);
};

fetchGallery();
