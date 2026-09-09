/* =========================================
   GOVILA — ADICIONAR PRODUTOS
   scripts/add.js
========================================= */

const emojiMap = {
  "Água Mineral 1.5L": "💧",
  "Arroz 5kg": "🍚",
  "Detergente 500ml": "🧴",
  "Cabo USB-C": "🔌"
};


/* =========================================
   GARANTIR QUE O CARRINHO EXISTE
========================================= */

if (typeof cart === "undefined") {
  console.error("Govila: o carrinho não foi encontrado.");
}


/* =========================================
   ATUALIZAR BOTÃO DO PRODUTO
========================================= */

function updateProductButton(btn) {

  if (!btn) {
    return;
  }

  const name = btn.dataset.product;

  if (!name || typeof cart === "undefined") {
    return;
  }

  const item = cart.find(
    product => product.name === name
  );

  /* Produto não está no carrinho */
  if (!item) {

    btn.classList.remove("quantity-btn");

    btn.innerHTML = `
      Adicionar
      <i class="hgi-stroke hgi-add-01"></i>
    `;

    return;
  }


  /* Produto já está no carrinho */

  btn.classList.add("quantity-btn");

  btn.innerHTML = `
    <span
      class="qty-control"
      role="group"
      aria-label="Quantidade de ${name}"
    >

      <span
        class="qty-minus"
        data-product-action="minus"
        aria-label="Diminuir quantidade"
      >
        −
      </span>

      <strong class="product-qty">
        ${item.qty}
      </strong>

      <span
        class="qty-plus"
        data-product-action="plus"
        aria-label="Aumentar quantidade"
      >
        +
      </span>

    </span>
  `;
}


/* =========================================
   ATUALIZAR TODOS OS BOTÕES
========================================= */

function updateAllProductButtons() {

  if (typeof cart === "undefined") {
    return;
  }

  document
    .querySelectorAll(".add-btn")
    .forEach(btn => {

      updateProductButton(btn);

    });
}


/* =========================================
   ADICIONAR / ALTERAR PRODUTO
========================================= */

document.addEventListener(
  "click",
  event => {

    const btn = event.target.closest(".add-btn");

    if (!btn) {
      return;
    }

    const actionElement =
      event.target.closest("[data-product-action]");

    const name =
      btn.dataset.product;

    const price =
      Number(btn.dataset.price);


    if (
      !name ||
      !Number.isFinite(price) ||
      typeof cart === "undefined"
    ) {
      return;
    }


    /* =====================================
       PRODUTO JÁ EXISTE
    ===================================== */

    let item = cart.find(
      product => product.name === name
    );


    /* =====================================
       DIMINUIR
    ===================================== */

    if (
      actionElement &&
      actionElement.dataset.productAction === "minus"
    ) {

      if (!item) {
        return;
      }

      item.qty--;


      if (item.qty <= 0) {

        const index =
          cart.indexOf(item);

        if (index !== -1) {
          cart.splice(index, 1);
        }

        showToast(
          `${name} removido do carrinho.`
        );

      } else {

        showToast(
          `${name}: ${item.qty} unidade(s).`
        );

      }


      updateCartUI();
      updateAllProductButtons();

      return;
    }


    /* =====================================
       AUMENTAR
    ===================================== */

    if (
      actionElement &&
      actionElement.dataset.productAction === "plus"
    ) {

      if (item) {

        item.qty++;

      } else {

        item = {
          name: name,
          price: price,
          qty: 1,
          emoji:
            emojiMap[name] || "🛍️"
        };

        cart.push(item);
      }


      updateCartUI();
      updateAllProductButtons();

      showToast(
        `${name}: ${item.qty} unidade(s).`
      );

      return;
    }


    /* =====================================
       PRIMEIRO CLIQUE — ADICIONAR
    ===================================== */

    if (!item) {

      item = {
        name: name,
        price: price,
        qty: 1,
        emoji:
          emojiMap[name] || "🛍️"
      };

      cart.push(item);

    } else {

      item.qty++;

    }


    updateCartUI();

    updateAllProductButtons();


    showToast(
      `${name} adicionado ao carrinho.`
    );

  }
);


/* =========================================
   SINCRONIZAR AO CARREGAR
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateAllProductButtons();

  }
);
