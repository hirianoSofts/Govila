/* =========================================
   ELEMENTOS DE PRODUTOS E LOJAS
========================================= */

const searchInput = $("#searchInput");
const clearSearch = $("#clearSearch");
const emptyProducts = $("#emptyProducts");


/* =========================================
   PRODUTOS — DADOS
========================================= */

let produtos = [];


/* =========================================
   PRODUTOS — CARREGAR DO JSON
========================================= */

async function loadProducts() {

  try {

    const response =
      await fetch("produtos.json");


    if (!response.ok) {
      throw new Error(
        `Erro HTTP: ${response.status}`
      );
    }


    produtos =
      await response.json();


    renderProducts(produtos);


    /*
       Permite que o sistema de pesquisa
       e filtros trabalhe normalmente.
    */

    filterProducts();


  } catch (error) {

    console.error(
      "Erro ao carregar produtos:",
      error
    );


    const productGrid =
      document.querySelector(
        "#productGrid"
      );


    if (productGrid) {

      productGrid.innerHTML = `

        <div class="empty-state">

          <i class="hgi-stroke hgi-alert-02"></i>

          <h3>Não foi possível carregar os produtos</h3>

          <p>
            Tente novamente mais tarde.
          </p>

        </div>

      `;

    }

  }

}


/* =========================================
   RENDERIZAR PRODUTOS
========================================= */

function renderProducts(lista = produtos) {

  const productGrid =
    document.querySelector("#productGrid");


  if (!productGrid) {
    return;
  }


  productGrid.innerHTML = "";


  if (!lista.length) {

    if (emptyProducts) {
      emptyProducts.hidden = false;
    }

    return;
  }


  if (emptyProducts) {
    emptyProducts.hidden = true;
  }


  lista.forEach(produto => {

    const oldPrice =
      produto.precoAntigo !== null &&
      produto.precoAntigo !== undefined

        ? `
          <del
            class="product-old-price"
            data-price-mzn="${produto.precoAntigo}">
            ${produto.precoAntigo} MT
          </del>
        `

        : "";


    const badge =
      produto.badge

        ? `
          <span class="product-badge">
            ${produto.badge}
          </span>
        `

        : "";


    const card =
      document.createElement("article");


    card.className =
      "product-card";


    card.dataset.category =
      produto.categoria;


    card.dataset.name =
      produto.nome;


    card.innerHTML = `

      <div class="product-image">

        ${badge}

        <button
          class="product-heart"
          type="button"
          aria-label="Adicionar aos favoritos">

          <i class="hgi-stroke hgi-favourite"></i>

        </button>


        <a
          href="product/index.html?produto=${encodeURIComponent(produto.id)}"
          class="product-image-link"
          aria-label="Ver ${produto.nome}">

          <img
            src="${produto.imagem}"
            alt="${produto.nome}"
            class="product-img"
            loading="lazy">

        </a>

      </div>


      <div class="product-info">

        <small>
          ${produto.loja}
        </small>


        <h3>

          <a
            href="product/index.html?produto=${encodeURIComponent(produto.id)}">

            ${produto.nome}

          </a>

        </h3>


        <div class="price-row">

          <strong
            class="product-price"
            data-price-mzn="${produto.preco}">

            ${produto.preco} MT

          </strong>

          ${oldPrice}

        </div>


        <button
          class="add-btn"
          data-product="${produto.nome}"
          data-price="${produto.preco}"
          data-product-id="${produto.id}">

          Adicionar

          <i class="hgi-stroke hgi-add-01"></i>

        </button>

      </div>

    `;


    productGrid.appendChild(card);

  });


  /*
     Os produtos foram criados
     dinamicamente, portanto precisamos
     ligar novamente os favoritos.
  */

  initProductFavorites();


  /*
     Atualizar o sistema de moeda
     depois de criar os preços.
  */

  if (
    typeof initCurrencySystem ===
    "function"
  ) {

    initCurrencySystem();

  }

}


/* =========================================
   FAVORITOS DOS PRODUTOS
========================================= */

function initProductFavorites() {

  $$(".product-heart")
    .forEach(btn => {

      /*
         Evita adicionar o mesmo evento
         várias vezes.
      */

      if (
        btn.dataset.favoriteReady ===
        "true"
      ) {

        return;

      }


      btn.dataset.favoriteReady =
        "true";


      btn.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          btn.classList.toggle(
            "liked"
          );


          showToast(

            btn.classList.contains("liked")

              ? "Adicionado aos favoritos."

              : "Removido dos favoritos."

          );

        }
      );

    });

}


/* =========================================
   SEGUIR LOJAS
========================================= */

$$(".follow-btn")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        const following =
          btn.classList.toggle(
            "following"
          );


        const icon =
          $("i", btn);


        const text =
          $("span", btn);


        if (following) {

          if (text) {
            text.textContent =
              "Seguindo";
          }


          if (icon) {

            icon.className =
              "hgi-stroke hgi-checkmark-01";

          }


          showToast(
            "Está a seguir esta loja."
          );


        } else {

          if (text) {
            text.textContent =
              "Seguir";
          }


          if (icon) {

            icon.className =
              "hgi-stroke hgi-add-01";

          }


          showToast(
            "Deixou de seguir esta loja."
          );

        }

      }
    );

  });


/* =========================================
   LOJAS
========================================= */

$$(".store-link")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        const store =
          btn.dataset.store ||
          "Esta loja";


        showToast(
          `${store}: catálogo em breve.`
        );

      }
    );

  });


/* =========================================
   PESQUISA
========================================= */

function filterProducts() {

  if (!searchInput) {
    return;
  }


  const term =
    searchInput.value
      .trim()
      .toLowerCase();


  let visible = 0;


  $$(".product-card")
    .forEach(card => {

      const name =
        (
          card.dataset.name ||
          ""
        ).toLowerCase();


      const category =
        (
          card.dataset.category ||
          ""
        ).toLowerCase();


      const matches =
        !term ||
        name.includes(term) ||
        category.includes(term);


      card.style.display =
        matches
          ? ""
          : "none";


      if (matches) {
        visible++;
      }

    });


  if (emptyProducts) {

    emptyProducts.hidden =
      visible !== 0;

  }


  if (clearSearch) {

    clearSearch.style.display =
      term
        ? "block"
        : "none";

  }

}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    filterProducts
  );

}


if (clearSearch) {

  clearSearch.addEventListener(
    "click",
    () => {

      if (searchInput) {

        searchInput.value = "";

        filterProducts();

        searchInput.focus();

      }

    }
  );

}


/* =========================================
   FILTROS
========================================= */

$$(".filter-btn").forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      $$(".filter-btn")
        .forEach(button => {

          button.classList.remove(
            "active"
          );

        });


      btn.classList.add(
        "active"
      );


      const filter =
        (
          btn.dataset.filter ||
          ""
        ).toLowerCase();


      const search =
        searchInput

          ? searchInput.value
              .trim()
              .toLowerCase()

          : "";


      let visible = 0;


      $$(".product-card")
        .forEach(card => {

          const category =
            (
              card.dataset.category ||
              ""
            ).toLowerCase();


          const name =
            (
              card.dataset.name ||
              ""
            ).toLowerCase();


          const categoryMatch =
            filter === "todos" ||
            category === filter;


          const searchMatch =
            !search ||
            name.includes(search) ||
            category.includes(search);


          const show =
            categoryMatch &&
            searchMatch;


          card.style.display =
            show
              ? ""
              : "none";


          if (show) {
            visible++;
          }

        });


      if (emptyProducts) {

        emptyProducts.hidden =
          visible !== 0;

      }

    }
  );

});


/* =========================================
   CATEGORIAS
========================================= */

$$(".category-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const category =
          card.dataset.category ||
          "";


        const normalized =
          category.toLowerCase();


        let matching = [];


        if (
          normalized ===
          "supermercado"
        ) {

          matching =
            $$(".product-card")
              .filter(product =>

                (
                  product.dataset.category ||
                  ""
                ).toLowerCase() ===
                "alimentação"

              );

        } else {

          matching =
            $$(".product-card")
              .filter(product =>

                (
                  product.dataset.category ||
                  ""
                ).toLowerCase() ===
                normalized

              );

        }


        $$(".product-card")
          .forEach(product => {

            product.style.display =
              "none";

          });


        matching.forEach(product => {

          product.style.display =
            "";

        });


        if (emptyProducts) {

          emptyProducts.hidden =
            matching.length !== 0;

        }


        const productsSection =
          document.querySelector(
            "#mais-vendidos"
          );


        if (productsSection) {

          productsSection.scrollIntoView({
            behavior: "smooth"
          });

        }


        showToast(
          `A mostrar produtos de ${category}.`
        );

      }
    );

  });


/* =========================================
   INICIALIZAÇÃO DE PRODUTOS E LOJAS
========================================= */

loadProducts();