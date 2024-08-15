import { debounce } from './application/utils';
import { getStorageData } from './application/storage-service';
import { JobInformation } from './models/job-information';
import { StorageData } from './models/storage-data';
import { getConverterForDomain } from './application/converters/price-converters-factory';
import { PriceConverter } from './application/converters/price-converter.interface';

let observer: MutationObserver;
let converter: PriceConverter;

getConverter();
getStorageData().then((storageData) => {
  if (!converter) return;

  addStorageDataListener();
  observeBodyChangesAndReplacePrices(storageData.jobInformation);
});

function addStorageDataListener() {
  chrome.runtime.onMessage.addListener(async (request) => {
    console.log('Update received');
    if (!request.storageData || !converter) return;

    const storageData = StorageData.fromJson(request.storageData);
    console.log('Call revert');
    await converter.revert();
    console.log('revert end');
    observeBodyChangesAndReplacePrices(storageData.jobInformation);
  });
}

function observeBodyChangesAndReplacePrices(jobInformation: JobInformation) {
  if (observer) {
    observer.disconnect();
  }

  replacePricesByTime(jobInformation);
  observer = new MutationObserver(
    debounce(async () => {
      console.log('mutation triggered');
      await replacePricesByTime(jobInformation);
    }, 500),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    childList: true,
    subtree: true,
  });
}

async function replacePricesByTime(jobInformation: JobInformation) {
  console.log('replacing prices...');
  await converter.convert(jobInformation);
}

function getConverter() {
  const domain = window.location.toString();
  converter = getConverterForDomain(domain, document);
  if (!converter) {
    console.warn(`No converter found for domain: ${domain}`);
  }
}
