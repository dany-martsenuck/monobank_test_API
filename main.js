const MONOBANK_ACQUIRING_URL = "https://api.monobank.ua";
const INVOICE_ID_PARAM = "invoiceId";
const PAYMENT_SUCCESS_CODE = 200;

// Replace with your own API token
const API_TOKEN = "uCvdISjbrd2FHrsLAj1quAaX5j2N_ddmHm8_izsglRXw";

const form = document.querySelector("#payment-form");
const successAlert = document.querySelector("#success-alert");
const errorAlert = document.querySelector("#error-alert");
const amountInput = document.querySelector("#amount-input");
const currencySelect = document.querySelector("#currency-select");
const descriptionInput = document.querySelector("#description-input");

// Set currency options based on the supported currencies of the API
const supportedCurrencies = ["980", "840", "978"]; // UAH, USD, EUR
for (let currency of supportedCurrencies) {
  const option = document.createElement("option");
  option.value = currency;
  option.text = currency;
  currencySelect.add(option);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Disable the form and show loading spinner
  form.classList.add("is-loading");
  successAlert.classList.add("is-hidden");
  errorAlert.classList.add("is-hidden");

  const amount = parseInt(amountInput.value) * 100; // Convert to minimum currency unit
  const currency = parseInt(currencySelect.value);
  const description = descriptionInput.value;

  try {
    // Create a new payment invoice
    const response = await fetch(`${MONOBANK_ACQUIRING_URL}/personal/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
      }),
    });

    const invoice = await response.json();
    const invoiceId = invoice.invoiceId;

    // Redirect user to payment page
    window.location.href = `${MONOBANK_ACQUIRING_URL}/personal/invoice/send?invoiceId=${invoiceId}`;
  } catch (error) {
    console.error(error);
    errorAlert.classList.remove("is-hidden");
  } finally {
    // Re-enable the form and hide loading spinner
    form.classList.remove("is-loading");
  }
});

// Check payment status when redirected back to the site
const urlParams = new URLSearchParams(window.location.search);
const invoiceId = urlParams.get(INVOICE_ID_PARAM);

if (invoiceId) {
  (async function checkPaymentStatus() {
    try {
      const response = await fetch(
        `${MONOBANK_ACQUIRING_URL}/personal/invoice/${invoiceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Token": API_TOKEN,
          },
        }
      );

      const paymentStatus = await response.json();

      if (response.status === PAYMENT_SUCCESS_CODE) {
        const successMessage = `Payment successful! Masked card number: ${paymentStatus.maskedPan}`;
        successAlert.textContent = successMessage;
        successAlert.classList.remove("is-hidden");
      } else {
        console.error(paymentStatus);
        errorAlert.classList.remove("is-hidden");
      }
    } catch (error) {
      console.error(error);
      errorAlert.classList.remove("is-hidden");
    }
  })();
}
