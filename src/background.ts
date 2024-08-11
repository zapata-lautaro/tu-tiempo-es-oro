import { getConversion } from './application/dolar-convertion-updater';
import { Currency } from './models/currency.enum';
import { initializeStorageWithDefaults } from './application/storage-service';

chrome.runtime.onInstalled.addListener(async () => {
  await initializeStorageWithDefaults({
    dolarConvertion: await getConversion(),
    jobInformation: {
      laboralDaysPerWeek: 0,
      hoursPerLaboralDay: 0,
      usdSalary: 0,
      pesosSalary: 0,
      currency: Currency.ARS,
    },
  });

  console.log('Extension successfully installed!');
});
