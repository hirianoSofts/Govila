/* =========================================
   AVALIAÇÃO INTERATIVA
========================================= */

const interactiveStars =
  document.getElementById("interactiveStars");

const ratingText =
  document.getElementById("ratingText");

const submitReview =
  document.getElementById("submitReview");

let selectedRating = 0;

const ratingLabels = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Boa",
  5: "Excelente"
};


if (interactiveStars) {

  const stars =
    interactiveStars.querySelectorAll("button");

  stars.forEach(star => {

    star.addEventListener("click", () => {

      selectedRating =
        Number(star.dataset.rating);

      stars.forEach(item => {

        const value =
          Number(item.dataset.rating);

        item.classList.toggle(
          "active",
          value <= selectedRating
        );

      });

      if (ratingText) {

        ratingText.textContent =
          ratingLabels[selectedRating];

      }

    });

  });

}


if (submitReview) {

  submitReview.addEventListener("click", () => {

    const reviewText =
      document.getElementById("reviewText");

    if (!selectedRating) {

      if (typeof showToast === "function") {
        showToast(
          "Selecione uma classificação."
        );
      }

      return;

    }

    if (
      !reviewText ||
      !reviewText.value.trim()
    ) {

      if (typeof showToast === "function") {
        showToast(
          "Escreva uma avaliação."
        );
      }

      return;

    }

    if (typeof showToast === "function") {

      showToast(
        "Avaliação publicada com sucesso."
      );

    }

    reviewText.value = "";

    selectedRating = 0;

    interactiveStars
      ?.querySelectorAll("button")
      .forEach(button => {
        button.classList.remove("active");
      });

    if (ratingText) {

      ratingText.textContent =
        "Selecione uma classificação";

    }

  });

}
