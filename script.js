const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


/* =========================================
   ELEMENTOS PRINCIPAIS
========================================= */

const sideMenu = $("#sideMenu");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");

const menuBtn = $("#menuBtn");
const closeMenu = $("#closeMenu");

const cartBtn = $("#cartBtn");
const mobileCartBtn = $("#mobileCartBtn");
const closeCart = $("#closeCart");

const cartItems = $("#cartItems");
const cartCountEl = $("#cartCount");
const mobileCartCountEl = $("#mobileCartCount");

const cartSubtotalEl = $("#cartSubtotal");
const deliveryFeeEl = $("#deliveryFee");
const cartTotalEl = $("#cartTotal");

const toast = $("#toast");


/* =========================================
   CARRINHO
========================================= */

const cart = [];

let cartCount = 0;


/* =========================================
   DRAWERS
========================================= */

function openDrawer(drawer) {

  if (!drawer) {
    return;
  }

  closeDrawers();

  drawer.classList.add("open");

  if (overlay) {
    overlay.classList.add("show");
  }

  document.body.style.overflow = "hidden";

}


function closeDrawers() {

  if (sideMenu) {
    sideMenu.classList.remove("open");
  }

  if (cartDrawer) {
    cartDrawer.classList.remove("open");
  }

  if (overlay) {
    overlay.classList.remove("show");
  }

  document.body.style.overflow = "";

}


/* =========================================
   MENU
========================================= */

if (menuBtn) {

  menuBtn.addEventListener(
    "click",
    () => openDrawer(sideMenu)
  );

}


if (closeMenu) {

  closeMenu.addEventListener(
    "click",
    closeDrawers
  );

}


/* =========================================
   CARRINHO
========================================= */

if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    () => openDrawer(cartDrawer)
  );

}


if (mobileCartBtn) {

  mobileCartBtn.addEventListener(
    "click",
    () => openDrawer(cartDrawer)
  );

}


if (closeCart) {

  closeCart.addEventListener(
    "click",
    closeDrawers
  );

}


if (overlay) {

  overlay.addEventListener(
    "click",
    closeDrawers
  );

}


/* =========================================
   LINKS DO MENU
========================================= */

$$(".side-links a").forEach(link => {

  link.addEventListener(
    "click",
    closeDrawers
  );

});


/* =========================================
   TOAST
========================================= */

function showToast(message) {

  if (!toast) {
    return;
  }


  const text =
    $(".toast span", toast);


  if (text) {
    text.textContent = message;
  }


  toast.classList.add("show");


  clearTimeout(showToast.timer);


  showToast.timer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);

}


/* =========================================
   CARRINHO — ATUALIZAR UI
========================================= */

function updateCartUI() {

  const totalItems =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  const delivery =
    subtotal > 0 ? 80 : 0;


  cartCount =
    totalItems;


  if (cartCountEl) {

    cartCountEl.textContent =
      totalItems;

  }


  if (mobileCartCountEl) {

    mobileCartCountEl.textContent =
      totalItems;

  }


  if (cartSubtotalEl) {

    cartSubtotalEl.textContent =
      formatPrice(subtotal);

  }


  if (deliveryFeeEl) {

    deliveryFeeEl.textContent =
      formatPrice(delivery);

  }


  if (cartTotalEl) {

    cartTotalEl.textContent =
      formatPrice(
        subtotal + delivery
      );

  }


  renderCart();

}


/* =========================================
   RENDERIZAR CARRINHO
========================================= */

function renderCart() {

  if (!cartItems) {
    return;
  }


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="hgi-stroke hgi-shopping-cart-01"></i>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos para começar.</p>
      </div>
    `;

    return;

  }


  cartItems.innerHTML =
    cart.map(
      (item, index) => `

        <div class="cart-item">

          <div class="cart-item-icon">
            ${item.emoji}
          </div>

          <div class="cart-item-info">

            <strong>
              ${item.name}
            </strong>

            <small>
              ${formatPrice(item.price)}
              por unidade
            </small>

            <div class="cart-item-row">

              <b>
                ${formatPrice(
                  item.price * item.qty
                )}
              </b>

              <div class="qty">

                <button
                  type="button"
                  data-action="minus"
                  data-index="${index}">
                  −
                </button>

                <span>
                  ${item.qty}
                </span>

                <button
                  type="button"
                  data-action="plus"
                  data-index="${index}">
                  +
                </button>

              </div>

            </div>

          </div>

        </div>

      `
    ).join("");

}


/* =========================================
   QUANTIDADE DO CARRINHO
========================================= */

if (cartItems) {

  cartItems.addEventListener(
    "click",
    event => {

      const btn =
        event.target.closest(
          "[data-action]"
        );


      if (!btn) {
        return;
      }


      const index =
        Number(
          btn.dataset.index
        );


      const action =
        btn.dataset.action;


      if (!cart[index]) {
        return;
      }


      if (action === "plus") {

        cart[index].qty++;

      }


      if (action === "minus") {

        cart[index].qty--;


        if (
          cart[index].qty <= 0
        ) {

          cart.splice(
            index,
            1
          );

        }

      }


      updateCartUI();

    }
  );

}


/* =========================================
   NAVEGAÇÃO RÁPIDA
========================================= */

$$(".quick-link")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        $$(".quick-link")
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });


        link.classList.add(
          "active"
        );

      }
    );

  });


/* =========================================
   PROMOÇÕES
========================================= */

const promoBtn =
  $("#promoBtn");


if (promoBtn) {

  promoBtn.addEventListener(
    "click",
    () => {

      const products =
        document.querySelector(
          "#mais-vendidos"
        );


      if (products) {

        products.scrollIntoView({
          behavior: "smooth"
        });

      }


      showToast(
        "A mostrar os produtos em promoção."
      );

    }
  );

}


/* =========================================
   TODAS AS CATEGORIAS
========================================= */

const allCategoriesBtn =
  $("#allCategoriesBtn");


if (allCategoriesBtn) {

  allCategoriesBtn.addEventListener(
    "click",
    () => {

      const categories =
        document.querySelector(
          "#categorias"
        );


      if (categories) {

        categories.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );

}


/* =========================================
   PARCEIROS
========================================= */

const partnerBtn =
  $("#partnerBtn");


if (partnerBtn) {

  partnerBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Área de parceiros: em breve."
      );

    }
  );

}


/* =========================================
   CHECKOUT
========================================= */

const checkoutBtn =
  $("#checkoutBtn");


if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    () => {

      if (!cart.length) {

        showToast(
          "Adicione produtos antes de continuar."
        );

        return;

      }


      showToast(
        "Checkout e pagamento serão integrados nesta etapa."
      );

    }
  );

}


/* =========================================
   TECLA ESC
========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }


    closeDrawers();


    /*
       Não usamos mais currencySelector
       nem currencyBtn diretamente aqui,
       porque pertencem ao moeda.js.
    */

    const currencySelectorEl =
      document.querySelector(
        "#currencySelector"
      );


    const currencyBtnEl =
      document.querySelector(
        "#currencyBtn"
      );


    if (currencySelectorEl) {

      currencySelectorEl.classList.remove(
        "open"
      );

    }


    if (currencyBtnEl) {

      currencyBtnEl.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

initCurrencySystem();

updateCartUI();