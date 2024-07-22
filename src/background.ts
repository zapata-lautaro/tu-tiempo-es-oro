import updateDolarConvertionIfOutdated from "./dolar-convertion-updater"

chrome.runtime.onInstalled.addListener(updateDolarConvertionIfOutdated);
