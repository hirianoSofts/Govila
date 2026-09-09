/* =========================================
   GOVILA — SISTEMA DE MOEDAS
   ExchangeRate-API
========================================= */

const EXCHANGE_API_KEY = "eaf6dbb37abe9961bda5d287";

const EXCHANGE_API_URL =
  `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

const RATES_STORAGE_KEY = "govilaCurrencyRates";
const RATES_TIME_KEY = "govilaCurrencyRatesTime";

const RATE_CACHE_TIME = 12 * 60 * 60 * 1000;


/* =========================================
   MOEDAS
========================================= */

const currencies = {

  MZN: {
    flag: "🇲🇿",
    name: "Metical",
    rate: 1,
    locale: "pt-MZ"
  },

  USD: {
    flag: "🇺🇸",
    name: "Dólar",
    rate: null,
    locale: "en-US"
  },

  ZAR: {
    flag: "🇿🇦",
    name: "Rand",
    rate: null,
    locale: "en-ZA"
  },

  AOA: {
    flag: "🇦🇴",
    name: "Kwanza",
    rate: null,
    locale: "pt-AO"
  },

  EUR: {
    flag: "🇪🇺",
    name: "Euro",
    rate: null,
    locale: "de-DE"
  },

  BRL: {
    flag: "🇧🇷",
    name: "Real",
    rate: null,
    locale: "pt-BR"
  }

};


/* =========================================
   MOEDA ATUAL
========================================= */

let currentCurrency =
  localStorage.getItem("govilaCurrency") || "MZN";

if (!currencies[currentCurrency]) {
  currentCurrency = "MZN";
}


/* =========================================
   ELEMENTOS
========================================= */

const currencySelector =
  document.querySelector("#currencySelector");

const currencyBtn =
  document.querySelector("#currencyBtn");

const currencyFlag =
  document.querySelector("#currencyFlag");

const currencyCode =
  document.querySelector("#currencyCode");


/* =========================================
   CARREGAR CACHE
========================================= */

function loadCachedRates() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(RATES_STORAGE_KEY)
      );

    if (!saved || typeof saved !== "object") {
      return false;
    }

    let validRates = 0;

    Object.keys(currencies).forEach(code => {

      if (code === "MZN") {
        currencies.MZN.rate = 1;
        return;
      }

      const rate = Number(saved[code]);

      if (
        Number.isFinite(rate) &&
        rate > 0
      ) {

        currencies[code].rate = rate;

        validRates++;

      }

    });

    /*
       Só consideramos o cache válido
       se TODAS as moedas necessárias
       tiverem uma taxa.
    */

    return validRates === 5;

  } catch (error) {

    console.warn(
      "Govila: erro ao ler cache.",
      error
    );

    return false;

  }

}


/* =========================================
   GUARDAR TAXAS
========================================= */

function saveRates() {

  const rates = {};

  Object.keys(currencies).forEach(code => {

    const rate =
      Number(currencies[code].rate);

    if (
      Number.isFinite(rate) &&
      rate > 0
    ) {

      rates[code] = rate;

    }

  });

  localStorage.setItem(
    RATES_STORAGE_KEY,
    JSON.stringify(rates)
  );

  localStorage.setItem(
    RATES_TIME_KEY,
    Date.now().toString()
  );

}


/* =========================================
   VERIFICAR CACHE
========================================= */

function hasFreshRates() {

  const savedTime =
    Number(
      localStorage.getItem(
        RATES_TIME_KEY
      )
    );

  if (!savedTime) {
    return false;
  }

  const cacheIsFresh =
    Date.now() - savedTime <
    RATE_CACHE_TIME;

  if (!cacheIsFresh) {
    return false;
  }

  /*
     IMPORTANTE:
     mesmo que o tempo seja válido,
     verificamos se as taxas existem.
  */

  return Object.keys(currencies)
    .filter(code => code !== "MZN")
    .every(code => {

      const rate =
        Number(currencies[code].rate);

      return (
        Number.isFinite(rate) &&
        rate > 0
      );

    });

}


/* =========================================
   BUSCAR TAXAS
========================================= */

async function fetchExchangeRates() {

  /*
     Primeiro tenta usar cache.
  */

  if (hasFreshRates()) {

    console.log(
      "Govila: usando taxas guardadas."
    );

    updateProductPrices();

    if (typeof updateCartUI === "function") {
      updateCartUI();
    }

    return true;

  }


  console.log(
    "Govila: buscando taxas da ExchangeRate-API..."
  );


  try {

    const response =
      await fetch(
        EXCHANGE_API_URL,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      data.result !== "success" ||
      !data.conversion_rates
    ) {

      throw new Error(
        "Resposta inválida da API."
      );

    }


    const rates =
      data.conversion_rates;


    const mznRate =
      Number(rates.MZN);


    if (
      !Number.isFinite(mznRate) ||
      mznRate <= 0
    ) {

      throw new Error(
        "Taxa MZN inválida."
      );

    }


    /*
       A API fornece:

       1 USD = 63.6421 MZN

       1 USD = 15.9563 ZAR

       Para converter MZN → ZAR:

       15.9563 / 63.6421

       Portanto:

       MZN × (taxaDestino / taxaMZN)
    */


    Object.keys(currencies).forEach(code => {

      if (code === "MZN") {
        currencies.MZN.rate = 1;
        return;
      }


      const destinationRate =
        Number(rates[code]);


      if (
        Number.isFinite(destinationRate) &&
        destinationRate > 0
      ) {

        currencies[code].rate =
          destinationRate / mznRate;

      }

    });


    /*
       Confirma que todas as moedas
       ficaram com taxas válidas.
    */

    const allValid =
      Object.keys(currencies)
        .every(code => {

          const rate =
            Number(currencies[code].rate);

          return (
            Number.isFinite(rate) &&
            rate > 0
          );

        });


    if (!allValid) {

      throw new Error(
        "Uma ou mais taxas não foram obtidas."
      );

    }


    saveRates();


    console.log(
      "Govila: taxas atualizadas:",
      currencies
    );


    updateProductPrices();

    if (typeof updateCartUI === "function") {
      updateCartUI();
    }


    return true;


  } catch (error) {

    console.error(
      "Govila: erro ao atualizar câmbio:",
      error
    );


    /*
       Tenta usar cache antigo,
       mesmo que esteja expirado.
    */

    const hasOldCache =
      loadCachedRates();


    if (hasOldCache) {

      console.warn(
        "Govila: usando taxas antigas."
      );

    } else {

      console.warn(
        "Govila: nenhuma taxa disponível."
      );

    }


    updateProductPrices();

    if (typeof updateCartUI === "function") {
      updateCartUI();
    }


    return false;

  }

}


/* =========================================
   CONVERTER MZN → MOEDA
========================================= */

function convertPrice(mzn) {

  const value =
    Number(mzn);


  if (!Number.isFinite(value)) {
    return 0;
  }


  if (currentCurrency === "MZN") {
    return value;
  }


  const currency =
    currencies[currentCurrency];


  if (!currency) {
    return value;
  }


  const rate =
    Number(currency.rate);


  if (
    !Number.isFinite(rate) ||
    rate <= 0
  ) {

    /*
       Ainda sem taxa.
       Não transforma o preço
       incorretamente.
    */

    return value;

  }


  return value * rate;

}


/* =========================================
   FORMATAR PREÇO
========================================= */

function formatPrice(mzn) {

  const original =
    Number(mzn);


  if (!Number.isFinite(original)) {
    return "0 MT";
  }


  const value =
    convertPrice(original);


  const currency =
    currencies[currentCurrency];


  if (!currency) {

    return `${Math.round(original).toLocaleString("pt-MZ")} MT`;

  }


  /*
     MZN
  */

  if (currentCurrency === "MZN") {

    return `${Math.round(value).toLocaleString("pt-MZ")} MT`;

  }


  /*
     Se ainda não existe taxa,
     mostramos MZN temporariamente.
  */

  if (
    !Number.isFinite(currency.rate) ||
    currency.rate <= 0
  ) {

    return `${Math.round(original).toLocaleString("pt-MZ")} MT`;

  }


  const formatted =
    value.toLocaleString(
      currency.locale,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );


  switch (currentCurrency) {

    case "USD":
      return `$${formatted}`;

    case "ZAR":
      return `R ${formatted}`;

    case "AOA":
      return `${formatted} Kz`;

    case "EUR":
      return `€${formatted}`;

    case "BRL":
      return `R$ ${formatted}`;

    default:
      return formatted;

  }

}


/* =========================================
   ATUALIZAR BOTÃO
========================================= */

function updateCurrencyButton() {

  const currency =
    currencies[currentCurrency];


  if (!currency) {
    return;
  }


  if (currencyFlag) {

    currencyFlag.textContent =
      currency.flag;

  }


  if (currencyCode) {

    currencyCode.textContent =
      currentCurrency;

  }


  document
    .querySelectorAll(".currency-option")
    .forEach(option => {

      const code =
        String(
          option.dataset.currency || ""
        ).toUpperCase();


      option.classList.toggle(
        "active",
        code === currentCurrency
      );

    });

}


/* =========================================
   ATUALIZAR PRODUTOS
========================================= */

function updateProductPrices() {

  document
    .querySelectorAll(
      ".product-price, .product-old-price"
    )
    .forEach(element => {

      const mzn =
        Number(
          element.dataset.priceMzn
        );


      if (!Number.isFinite(mzn)) {
        return;
      }


      element.textContent =
        formatPrice(mzn);

    });

}


/* =========================================
   ALTERAR MOEDA
========================================= */

async function setCurrency(currency) {

  currency =
    String(currency || "")
      .toUpperCase();


  if (!currencies[currency]) {
    return;
  }


  currentCurrency =
    currency;


  localStorage.setItem(
    "govilaCurrency",
    currentCurrency
  );


  updateCurrencyButton();
  updateProductPrices();


  if (typeof updateCartUI === "function") {
    updateCartUI();
  }


  if (currencySelector) {

    currencySelector.classList.remove(
      "open"
    );

  }


  if (currencyBtn) {

    currencyBtn.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  /*
     Se não houver taxa,
     busca imediatamente.
  */

  if (
    currentCurrency !== "MZN" &&
    (
      !Number.isFinite(
        Number(
          currencies[currentCurrency].rate
        )
      ) ||
      Number(
        currencies[currentCurrency].rate
      ) <= 0
    )
  ) {

    if (typeof showToast === "function") {

      showToast(
        "A atualizar taxa de câmbio..."
      );

    }


    await fetchExchangeRates();

  }


  if (typeof showToast === "function") {

    showToast(
      `Moeda alterada para ${currentCurrency}.`
    );

  }

}


/* =========================================
   BOTÃO DA MOEDA
========================================= */

if (currencyBtn && currencySelector) {

  currencyBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      const open =
        currencySelector.classList.toggle(
          "open"
        );


      currencyBtn.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

    }
  );

}


/* =========================================
   OPÇÕES
========================================= */

document
  .querySelectorAll(".currency-option")
  .forEach(option => {

    option.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        setCurrency(
          option.dataset.currency
        );

      }
    );

  });


/* =========================================
   CLICAR FORA
========================================= */

document.addEventListener(
  "click",
  event => {

    if (
      currencySelector &&
      !currencySelector.contains(
        event.target
      )
    ) {

      currencySelector.classList.remove(
        "open"
      );


      if (currencyBtn) {

        currencyBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }

  }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

function initCurrencySystem() {

  loadCachedRates();

  updateCurrencyButton();

  updateProductPrices();

  /*
     Sempre verifica a API.
     Se o cache estiver válido,
     fetchExchangeRates() não fará
     outra requisição.
  */

  fetchExchangeRates();

}