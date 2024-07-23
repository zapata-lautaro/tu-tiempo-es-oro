import updateDolarConvertionIfOutdated from './utils/dolar-convertion-updater';

chrome.runtime.onInstalled.addListener(updateDolarConvertionIfOutdated);
