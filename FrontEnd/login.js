document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.querySelector("#login form");
  const errorContainer = document.getElementById("error-container");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        window.location.href = "index.html";
      } else {
        const errorData = await response.json();
        errorContainer.textContent =
          errorData.message || "Erreur dans l’identifiant ou le mot de passe";
      }
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      errorContainer.textContent =
        "Une erreur s'est produite lors de la connexion.";
    }
  });
});
