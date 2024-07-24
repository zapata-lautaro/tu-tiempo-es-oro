import { getConversion } from './utils/dolar-convertion-updater';
import { Currency } from './utils/models/currency.enum';
import { initializeStorageWithDefaults } from './utils/storage-service';

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
    currency: Currency.ARS,
    pesosSalary: 100000,
    usdSalary: 68.97,
    hoursPerMonth: 160,
    hoursPerLaboralDay: 8,
  });

  console.log('Extension successfully installed!');
});
