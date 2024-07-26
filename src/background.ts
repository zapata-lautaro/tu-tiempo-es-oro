import { getConversion } from './application/dolar-convertion-updater';
import { Currency } from './models/currency.enum';
import { initializeStorageWithDefaults } from './application/storage-service';

chrome.runtime.onInstalled.addListener(async () => {
  let updatedDolarConvertion;
  try {
    updatedDolarConvertion = await getConversion();
  } catch (e) {
    console.log(e);
    updatedDolarConvertion = {
      updatedOn: Date.now(),
      ask: 1400,
      bid: 1450,
    };
  }
  await initializeStorageWithDefaults({
    dolarConvertion: updatedDolarConvertion,
    jobInformation: {
      hoursPerMonth: 160,
      hoursPerLaboralDay: 8,
      salary: 100000,
      currency: Currency.ARS,
    },
  });

  console.log('Extension successfully installed!');
});
