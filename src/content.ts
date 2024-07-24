import { debounce } from './utils/utils';
import PriceConverter from './utils/price-converter';
import { getStorageData } from './utils/storage-service';

getStorageData().then((storageData) => {
  const observer = new MutationObserver(
    debounce(() => {
      replacePricesByTime(
        storageData.pesosSalary,
        storageData.hoursPerMonth,
        storageData.hoursPerLaboralDay,
      );
    }, 500),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    attributes: true,
    childList: true,
    subtree: true,
  });
});

function replacePricesByTime(
  pesosSalary: number,
  hoursPerMonth: number,
  hoursPerLaboralDay: number,
) {
  console.log('replacing prices...');

  const prices = document.querySelectorAll('.andes-money-amount__fraction');

  if (!prices) return;
  const priceConverter = new PriceConverter(
    pesosSalary,
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
