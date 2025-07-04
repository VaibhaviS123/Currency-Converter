const BASE_URL = "https://api.frankfurter.app/latest";



const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".button"); // ← Updated to use .button class
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate the currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Button click to convert currency
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;
  const url = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const data = await res.json();
    const rate = data.rates[to];
    const result = rate;

    msg.innerText = `${amtVal} ${from} = ${result.toFixed(2)} ${to}`;
  } catch (err) {
    console.error("Fetch error:", err);
    msg.innerText = "⚠️ Could not fetch rate. Try again later.";
  }
});
