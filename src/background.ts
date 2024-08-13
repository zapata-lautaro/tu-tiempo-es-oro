import { getConversion } from './application/dolar-convertion-updater';
import { Currency } from './models/currency.enum';
import { initializeStorageWithDefaults } from './application/storage-service';

const DEFAULT_DAYS_PER_WEEK = 5;
const DEFAULT_HOURS_PER_DAY = 8;
const DEFAULT_SALARY = 0;

chrome.runtime.onInstalled.addListener(async () => {
  await initializeStorageWithDefaults({
    dolarConvertion: await getConversion(),
    jobInformation: {
      laboralDaysPerWeek: DEFAULT_DAYS_PER_WEEK,
      hoursPerLaboralDay: DEFAULT_HOURS_PER_DAY,
      usdSalary: DEFAULT_SALARY,
      pesosSalary: DEFAULT_SALARY,
      currency: Currency.ARS,
    },
  });

  console.log('Extension successfully installed!');
});
