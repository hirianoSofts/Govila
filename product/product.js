/* =========================================
   GOVILA — PRODUCT PAGE
========================================= */

const products = {

  agua: {
    name: "Água Mineral 1.5L",
    store: "Mercado Vilankulos",
    category: "Alimentação",
    price: 35,
    oldPrice: 39,
    discount: "-10%",
    emoji: "💧",
    badge: "-10%",
    rating: "4.8",

    description:
      "Água mineral de qualidade, ideal para consumo diário. Produto disponível no Mercado Vilankulos.",

    longDescription:
      "Água mineral de qualidade para consumo diário. Faça o seu pedido através do Govila e receba diretamente no local indicado."
  },


  arroz: {
    name: "Arroz 5kg",
    store: "Mercado Vilankulos",
    category: "Alimentação",
    price: 450,
    oldPrice: null,
    discount: null,
    emoji: "🍚",
    badge: "Popular",
    rating: "4.8",

    description:
      "Arroz de qualidade em embalagem de 5kg, ideal para o consumo familiar.",

    longDescription:
      "Arroz em embalagem de 5kg, disponível no Mercado Vilankulos através do Govila."
  },


  detergente: {
    name: "Detergente 500ml",
    store: "Mercado Vilankulos",
    category: "Casa",
    price: 85,
    oldPrice: 100,
    discount: "-15%",
    emoji: "🧴",
    badge: "-15%",
    rating: "4.7",

    description:
      "Detergente para limpeza doméstica, disponível no Mercado Vilankulos.",

    longDescription:
      "Detergente de 500ml para utilização doméstica. Compre através do Govila e receba onde estiver."
  },


  cabo: {
    name: "Cabo USB-C",
    store: "Praia Shopping",
    category: "Eletrónica",
    price: 300,
    oldPrice: null,
    discount: null,
    emoji: "🔌",
    badge: "Novo",
    rating: "4.9",

    description:
      "Cabo USB-C para carregamento e ligação de dispositivos compatíveis.",

    longDescription:
      "Cabo USB-C disponível no Praia Shopping. Faça o pedido pelo Govila e receba no local indicado."
  }

};


/* =========================================
   PRODUTO ATUAL
========================================= */

const params = new URLSearchParams(
  window.location.search
);

const productId =
  params.get("produto") || "agua";

const product =
  products[productId] || products.agua;


/* =========================================
   ELEMENTOS
========================================= */

const productName =
  document.getElementById("productName");

const productStore =
  document.getElementById("productStore");

const productEmoji =
  document.getElementById("productEmoji");

const thumbEmoji =
  document.getElementById("thumbEmoji");

const productBadge =
  document.getElementById("productBadge");

const productPrice =
  document.getElementById("productPrice");

const productOldPrice =
  document.getElementById("productOldPrice");

const productDiscount =
  document.getElementById("productDiscount");

const productRating =
  document.getElementById("productRating");

const productDescription =
  document.getElementById("productDescription");

const longDescription =
  document.getElementById("longDescription");

const breadcrumbCategory =
  document.getElementById("breadcrumbCategory");

const breadcrumbName =
  document.getElementById("breadcrumbName");

const detailQuantity =
  document.getElementById("detailQuantity");

const detailMinus =
  document.getElementById("detailMinus");

const detailPlus =
  document.getElementById("detailPlus");

const detailAddBtn =
  document.getElementById("detailAddBtn");

const favoriteProduct =
  document.getElementById("favoriteProduct");


/* =========================================
   PREENCHER PRODUTO
========================================= */

function loadProduct() {

  productName.textContent =
    product.name;

  productStore.textContent =
    product.store;

  productEmoji.textContent =
    product.emoji;

  thumbEmoji.textContent =
    product.emoji;

  productBadge.textContent =
    product.badge;

  productPrice.textContent =
    `${product.price} MT`;

  productRating.textContent =
    product.rating;

  productDescription.textContent =
    product.description;

  longDescription.textContent =
    product.longDescription;

  breadcrumbCategory.textContent =
    product.category;

  breadcrumbName.textContent =
    product.name;

  productPrice.dataset.priceMzn =
    product.price;


  /* PREÇO ANTIGO */

  if (product.oldPrice) {

    productOldPrice.textContent =
      `${product.oldPrice} MT`;

    productOldPrice.style.display =
      "";

  } else {

    productOldPrice.style.display =
      "none";

  }


  /* DESCONTO */

  if (product.discount) {

    productDiscount.textContent =
      product.discount;

    productDiscount.style.display =
      "";

  } else {

    productDiscount.style.display =
      "none";

  }


  /* TÍTULO */

  document.title =
    `${product.name} — Govila`;

}


/* =========================================
   QUANTIDADE
========================================= */

let quantity = 1;


function updateQuantity() {

  detailQuantity.textContent =
    quantity;

}


detailMinus.addEventListener(
  "click",
  () => {

    if (quantity > 1) {

      quantity--;

      updateQuantity();

    }

  }
);


detailPlus.addEventListener(
  "click",
  () => {

    quantity++;

    updateQuantity();

  }
);


/* =========================================
   ADICIONAR AO CARRINHO
========================================= */

detailAddBtn.addEventListener(
  "click",
  () => {

    if (
      typeof cart === "undefined"
    ) {

      console.error(
        "Govila: carrinho não encontrado."
      );

      return;

    }


    let item =
      cart.find(
        item =>
          item.name === product.name
      );


    if (item) {

      item.qty += quantity;

    } else {

      item = {

        name: product.name,

        price: product.price,

        qty: quantity,

        emoji: product.emoji

      };

      cart.push(item);

    }


    if (
      typeof updateCartUI ===
      "function"
    ) {

      updateCartUI();

    }


    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        `${quantity}x ${product.name} adicionado ao carrinho.`
      );

    }


    quantity = 1;

    updateQuantity();

  }
);


/* =========================================
   FAVORITO
========================================= */

if (favoriteProduct) {

  favoriteProduct.addEventListener(
    "click",
    () => {

      favoriteProduct.classList.toggle(
        "liked"
      );


      if (
        typeof showToast ===
        "function"
      ) {

        showToast(

          favoriteProduct.classList.contains(
            "liked"
          )

            ? "Adicionado aos favoritos."

            : "Removido dos favoritos."

        );

      }

    }
  );

}


/* =========================================
   PRODUTOS RELACIONADOS
========================================= */

function renderRelatedProducts() {

  const container =
    document.getElementById(
      "relatedProducts"
    );

  if (!container) return;


  container.innerHTML =
    Object.entries(products)

      .filter(
        ([id]) =>
          id !== productId
      )

      .map(
        ([id, item]) => `

          <article
            class="related-card"
            onclick="
              window.location.href =
              '?produto=${id}'
            "
          >

            <div
              class="related-image"
              style="
                background:
                linear-gradient(
                  135deg,
                  #edf4f6,
                  #d4e2e6
                );
              "
            >

              <span>
                ${item.emoji}
              </span>

            </div>

            <div class="related-info">

              <small>
                ${item.store}
              </small>

              <h3>
                ${item.name}
              </h3>

              <strong class="related-price">
                ${item.price} MT
              </strong>

            </div>

          </article>

        `
      )

      .join("");

}


/* =========================================
   INICIAR
========================================= */

loadProduct();

updateQuantity();

renderRelatedProducts();