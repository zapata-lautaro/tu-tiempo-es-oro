import { debounce } from './application/utils';
import { getStorageData } from './application/storage-service';
import { JobInformation } from './models/job-information';
import { StorageData } from './models/storage-data';
import { getConverterForDomain } from './application/converters/price-converters-factory';
import { PriceConverter } from './application/converters/price-converter.interface';

let observer: MutationObserver;
let converter: PriceConverter;
let lastStorageData: StorageData;

getConverter();
getStorageData().then((storageData) => {
  if (!converter) return;

  lastStorageData = storageData;
  addListeners();
  observeBodyChangesAndReplacePrices(storageData.jobInformation);
});

function addListeners() {
  chrome.runtime.onMessage.addListener(async (request) => {
    if (request.storageData) {
      const storageData = StorageData.fromJson(request.storageData);
      lastStorageData = storageData;
      await converter.revert();
      observeBodyChangesAndReplacePrices(storageData.jobInformation);
    }

    if (request.activeSwitchChange && request.activeSwitchChange.newValue) {
      observeBodyChangesAndReplacePrices(lastStorageData.jobInformation);
    }

    if (request.activeSwitchChange && !request.activeSwitchChange.newValue) {
      observer.disconnect();
      await converter.revert();
    }
  });
}

function observeBodyChangesAndReplacePrices(jobInformation: JobInformation) {
  if (observer) {
    observer.disconnect();
  }

  replacePricesByTime(jobInformation);
  observer = new MutationObserver(
    debounce(async () => {
      await replacePricesByTime(jobInformation);
    }, 1000),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    childList: true,
    subtree: true,
  });
}

async function replacePricesByTime(jobInformation: JobInformation) {
  await converter.convert(jobInformation);
}

function getConverter() {
  const domain = window.location.toString();
  converter = getConverterForDomain(domain, document);
  if (!converter) {
    console.warn(`No converter found for domain: ${domain}`);
  }
}
