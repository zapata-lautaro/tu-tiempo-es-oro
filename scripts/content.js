let salary = 0;
const hoursPerMonth = 160;
const hoursPerLaboralDay = 8;

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName("body")[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

chrome.storage.sync.get()
  .then(storage => {
    if(!storage.pesosSalary) return;

    salary = storage.pesosSalary;

    const observer = new MutationObserver(debounce(replacePricesByTime, 500));

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  });


function replacePricesByTime() {
  console.log("replacing prices...");

  const prices = document.querySelectorAll(".andes-money-amount__fraction");

  if (!prices) return;

  prices.forEach(priceElement => {
    const price = priceElement.textContent.replaceAll('.', '');

    priceElement.replaceWith(`${getPriceStringRepresentationInWorkingTime(price)}`);
  });

  const currencySimbols = document.querySelectorAll(".andes-money-amount__currency-symbol");  
  currencySimbols.forEach(simbolElement => {
    simbolElement.replaceWith(`⏱️`);
  });

  const cents = document.querySelectorAll(".andes-money-amount__cents");
  cents.forEach(centElement => {
    centElement.style.display = 'none';
  });
}

function getPriceStringRepresentationInWorkingTime(price) {
  let years = price / (salary * 12);

  if(Math.floor(years) > 0) {
    years = Math.round(years);
    return `${years} año${years > 1 ? 's' : ''}`;
  }

  let months = price / salary;

  if(Math.floor(months) > 0) {
    months = Math.round(months);
    return `${months} mes${months > 1 ? 'es' : ''}`;
  }

  let days = price / (salary / hoursPerMonth * hoursPerLaboralDay);

  if(Math.floor(days) > 0) {
    days = Math.round(days);
    return `${days} día${days > 1 ? 's' : ''}`;
  }

  let hours = price / (salary / hoursPerMonth);

  if(Math.floor(hours) > 0) {
    hours = Math.round(hours);
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
}

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}