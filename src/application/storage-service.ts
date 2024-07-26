import { StorageData, StorageDataProps } from '../models/storage-data';

export function getStorageData(): Promise<StorageData> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      return resolve(StorageData.fromJson(result as StorageDataProps));
    });
  });
}

export function setStorageData(data: StorageDataProps): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve();
    });
  });
}

export async function initializeStorageWithDefaults(
  defaults: StorageDataProps,
) {
  await setStorageData(defaults);
}
