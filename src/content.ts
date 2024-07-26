import { debounce } from './application/utils';
import PriceConverter from './application/price-converter';
import { getStorageData } from './application/storage-service';
import { JobInformation } from './models/job-information';

getStorageData().then((storageData) => {
  const observer = new MutationObserver(
    debounce(() => {
      replacePricesByTime(storageData.jobInformation);
    }, 500),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    attributes: true,
    childList: true,
    subtree: true,
  });
});

function replacePricesByTime(jobInformation: JobInformation) {
  console.log('replacing prices...');

  const prices = document.querySelectorAll('.andes-money-amount__fraction');

  if (!prices) return;
  const priceConverter = new PriceConverter(jobInformation);

  prices.forEach((priceElement) => {
    const price = +priceElement!.textContent!.replace('.', '');
    const priceConvertion = priceConverter.getConvertion(price);

    priceElement.replaceWith(
      `${priceConvertion.toShortStringRepresentation()}`,
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
