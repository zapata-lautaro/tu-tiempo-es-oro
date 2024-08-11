import { debounce } from './application/utils';
import { getStorageData } from './application/storage-service';
import { JobInformation } from './models/job-information';
import { MeliPriceConverter } from './application/converters/meli-price-converter';

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

  const meliPriceConverter = new MeliPriceConverter(document, jobInformation);

  meliPriceConverter.convert();
}
