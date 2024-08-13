import { debounce } from './application/utils';
import { getStorageData } from './application/storage-service';
import { JobInformation } from './models/job-information';
import { StorageData } from './models/storage-data';
import { getConverterForDomain } from './application/converters/price-converters-factory';

getStorageData().then(observeBodyChangesAndReplacePrices);

function observeBodyChangesAndReplacePrices(storageData: StorageData) {
  const observer = new MutationObserver(
    debounce(() => {
      if (storageData.jobInformation.salaryInOriginalCurrency() == 0) return;

      replacePricesByTime(storageData.jobInformation);
    }, 500),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function replacePricesByTime(jobInformation: JobInformation) {
  console.log('replacing prices...');

  const domain = window.location.hostname;
  const converter = getConverterForDomain(domain, document, jobInformation);

  if (converter) {
    converter.convert();
  } else {
    console.warn(`No converter found for domain: ${domain}`);
  }
}
