import { DomainConfiguration } from '../models/domain-configuration';
import { StorageData, StorageDataProps } from '../models/storage-data';

export const STORAGE_DATA_KEY = 'storageData';
export const DOMAINS_CONFIGURATION = 'domainsConfiguration';

export async function getStorageData(): Promise<StorageData> {
  const storageDataJson = await getData(STORAGE_DATA_KEY);
  return StorageData.fromJson(storageDataJson as StorageDataProps);
}

export async function setStorageData(data: StorageDataProps): Promise<void> {
  await setData(STORAGE_DATA_KEY, data);
}

export async function getDomainConfiguration(
  key: string,
): Promise<DomainConfiguration> {
  const domainsConfiguration = await getDomainsConfiguration();
  return domainsConfiguration[key]
    ? DomainConfiguration.fromJson(domainsConfiguration[key])
    : new DomainConfiguration(key, true);
}

export async function setDomainConfiguration(
  domainConfiguration: DomainConfiguration,
): Promise<void> {
  const domainsConfigurations = await getDomainsConfiguration();
  domainsConfigurations[domainConfiguration.key] = domainConfiguration;

  await setData(DOMAINS_CONFIGURATION, domainsConfigurations);
}

export async function initializeStorageWithDefaults(
  defaultStorageData: StorageDataProps,
) {
  await setStorageData(defaultStorageData);
  await setData(DOMAINS_CONFIGURATION, {});
}

async function getDomainsConfiguration(): Promise<{
  [key: string]: DomainConfiguration;
}> {
  return await getData(DOMAINS_CONFIGURATION);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getData(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      return resolve(result[key]);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setData(key: string, data: { [key: string]: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: data }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve();
    });
  });
}
