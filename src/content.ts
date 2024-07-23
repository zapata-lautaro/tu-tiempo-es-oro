import { debounce } from './utils/utils';
import PriceConverter from './utils/price-converter';

let salary = 0;
const hoursPerMonth = 160;
const hoursPerLaboralDay = 8;

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('body')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

chrome.storage.sync.get().then((storage) => {
  if (!storage.pesosSalary) return;

  salary = storage.pesosSalary;

  const observer = new MutationObserver(debounce(replacePricesByTime, 500));

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});

function replacePricesByTime() {
  console.log('replacing prices...');

  const prices = document.querySelectorAll('.andes-money-amount__fraction');

  if (!prices) return;
  const priceConverter = new PriceConverter(
    salary,
    hoursPerMonth,
    hoursPerLaboralDay,
  );

  prices.forEach((priceElement) => {
    const price = +priceElement!.textContent!.replace('.', '');

    priceElement.replaceWith(
      `${priceConverter.getStringRepresentation(price)}`,
    );
  });

  const currencySimbols = document.querySelectorAll(
    '.andes-money-amount__currency-symbol',
  );
  currencySimbols.forEach((simbolElement) => {
    simbolElement.replaceWith(`⏱️`);
  });

  const cents = document.querySelectorAll('.andes-money-amount__cents');
  cents.forEach((centElement) => {
    (centElement as HTMLElement).style.display = 'none';
  });
}
