import { debounce } from './application/utils';
import {
  DOMAINS_CONFIGURATION,
  getDomainConfiguration,
  getStorageData,
  STORAGE_DATA_KEY,
} from './application/storage-service';
import { JobInformation } from './models/job-information';
import { StorageData } from './models/storage-data';
import {
  getConverterForDomain,
  getKeyForDomain,
} from './application/converters/price-converters-factory';
import { PriceConverter } from './application/converters/price-converter.interface';
import { DomainConfigurationProps } from './models/domain-configuration';

let observer: MutationObserver;
let converter: PriceConverter;
let converterKey: string;
let lastStorageData: StorageData;
let lastDomainConfiguration: DomainConfigurationProps;

initializeContentScript().then(() => {
  console.log('content script init');
});

function addStorageListener() {
  chrome.storage.sync.onChanged.addListener(async (changes) => {
    if (Object.keys(changes).includes(STORAGE_DATA_KEY)) {
      const storageData = StorageData.fromJson(
        changes[STORAGE_DATA_KEY].newValue,
      );
      lastStorageData = storageData;

      if (lastDomainConfiguration.convertionEnabled) {
        await converter.revert();
        await observeBodyChangesAndReplacePrices();
      }
    }

    if (Object.keys(changes).includes(DOMAINS_CONFIGURATION)) {
      lastDomainConfiguration = changes[DOMAINS_CONFIGURATION].newValue[
        converterKey
      ] as DomainConfigurationProps;
      if (lastDomainConfiguration.convertionEnabled) {
        await observeBodyChangesAndReplacePrices();
      } else {
        observer?.disconnect();
        await converter?.revert();
      }
    }
  });
}

async function observeBodyChangesAndReplacePrices() {
  if (observer) {
    observer.disconnect();
  }
  if (!lastStorageData) {
    lastStorageData = await getStorageData();
  }

  replacePricesByTime(lastStorageData.jobInformation);
  observer = new MutationObserver(
    debounce(async () => {
      await replacePricesByTime(lastStorageData.jobInformation);
    }),
  );
  observer.observe(document.getElementsByTagName('body')[0], {
    childList: true,
    subtree: true,
  });
}

async function replacePricesByTime(jobInformation: JobInformation) {
  await converter.convert(jobInformation);
}

async function initializeContentScript() {
  const domain = window.location.toString();
  converter = getConverterForDomain(domain, document);
  converterKey = getKeyForDomain(domain);

  if (!converter) {
    console.warn(`No converter found for domain: ${domain}`);
  }
  lastStorageData = await getStorageData();
  addStorageListener();
  lastDomainConfiguration = await getDomainConfiguration(converterKey);
  if (lastDomainConfiguration.convertionEnabled) {
    observeBodyChangesAndReplacePrices();
  }
}
