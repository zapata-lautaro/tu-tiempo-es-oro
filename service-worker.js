import updateDolarConvertionIfOutdated from "/dolar-convertion-updater.js";

chrome.runtime.onInstalled.addListener(updateDolarConvertionIfOutdated);
