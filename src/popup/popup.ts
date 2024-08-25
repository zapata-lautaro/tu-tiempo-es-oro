import { getKeyForDomain } from '../application/converters/price-converters-factory';
import {
  getDomainConfiguration,
  getStorageData,
  setDomainConfiguration,
  setStorageData,
} from '../application/storage-service';
import { debounce } from '../application/utils';
import { Currency } from '../models/currency.enum';
import { DomainConfiguration } from '../models/domain-configuration';
import { StorageData } from '../models/storage-data';

let storageData: StorageData;
let domainConfiguration: DomainConfiguration;

const salaryInput = document.getElementById('salary')! as HTMLInputElement;
const currencySelect = document.getElementById(
  'currency',
)! as HTMLSelectElement;
const hoursPerDayInput = document.getElementById(
  'hoursPerDay',
)! as HTMLInputElement;
const daysPerWeekInput = document.getElementById(
  'daysPerWeek',
)! as HTMLInputElement;
const dolarBidSpan = document.getElementById('dolarBid')! as HTMLSpanElement;
const dolarAskSpan = document.getElementById('dolarAsk')! as HTMLSpanElement;
const domainEnableCheckbox = document.getElementById(
  'enableSwitch',
)! as HTMLInputElement;
const enableSwitchContainer = document.getElementById(
  'enableSwitchContainer',
)! as HTMLInputElement;
const calculatorPriceInput = document.getElementById(
  'calculator-price',
)! as HTMLInputElement;
const calculatorCurrencySelect = document.getElementById(
  'calculator-currency',
)! as HTMLSelectElement;
const calculatorButton = document.getElementById(
  'calculate-button',
)! as HTMLButtonElement;
const calculatorResult = document.getElementById(
  'calculator-result',
)! as HTMLElement;

salaryInput.oninput = currencySelect.onchange = debounce(handleSalaryChange);
hoursPerDayInput.oninput = daysPerWeekInput.onchange = debounce(
  handleLaboralDaysChange,
);
domainEnableCheckbox.oninput = debounce(handleEnableSwitchChange);
document.body.onload = async () => {
  await setStorageDataValues();
  await setCurrentDomainConfiguration();
};

calculatorButton.onclick = () => {
  const price = +calculatorPriceInput.value;

  if (storageData.jobInformation.hasMissingData()) {
    calculatorResult.textContent =
      'Debes introducir la informacion sobre tu salario';
    return;
  }

  if (!Number.isInteger(price) || price <= 0) {
    calculatorResult.textContent = 'Debes introducir un precio mayor a 0';
    return;
  }

  const timeConvertion = storageData.jobInformation.getTimeConvertion(
    price,
    calculatorCurrencySelect.value as Currency,
  );

  calculatorResult.textContent = `
    Debes trabajar ${timeConvertion.toFullStringRepresentation()} para pagar $${price}
  `;
};

async function setStorageDataValues() {
  storageData = await getStorageData();
  salaryInput.value = storageData.jobInformation
    .salaryInOriginalCurrency()
    .toString();
  currencySelect.value = storageData.jobInformation.currency;
  hoursPerDayInput.value =
    storageData.jobInformation.hoursPerLaboralDay.toString();
  daysPerWeekInput.value =
    storageData.jobInformation.laboralDaysPerWeek.toString();
  dolarAskSpan.textContent = storageData.dolarConvertion.ask.toString();
  dolarBidSpan.textContent = storageData.dolarConvertion.bid.toString();
}

async function setCurrentDomainConfiguration() {
  const domain = await getCurrentDomain();
  const currentDomainKey = getKeyForDomain(domain);
  if (!currentDomainKey) {
    domainEnableCheckbox.disabled = true;
    enableSwitchContainer.textContent = 'Página no soportada 🚫';
    return;
  }

  domainConfiguration = await getDomainConfiguration(currentDomainKey);
  domainEnableCheckbox.checked = domainConfiguration.convertionEnabled;
}

async function getCurrentDomain(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      const tab = tabs[0];
      resolve(tab.url);
    });
  });
}

async function handleSalaryChange() {
  const salary = +salaryInput.value;
  const currency = currencySelect.value;
  calculatorResult.textContent = null;
  calculatorPriceInput.value = null;

  try {
    storageData.updateSalary(salary, currency as Currency);

    await setStorageData(storageData);
  } catch (e) {
    console.log(e);
  }
}

async function handleLaboralDaysChange() {
  const hoursPerDay = +hoursPerDayInput.value;
  const daysPerWeek = +daysPerWeekInput.value;

  try {
    storageData.updateLaboralDaysInformation(hoursPerDay, daysPerWeek);

    await setStorageData(storageData);
  } catch (e) {
    console.log(e);
  }
}

async function handleEnableSwitchChange() {
  try {
    domainConfiguration.enable(domainEnableCheckbox.checked);

    await setDomainConfiguration(domainConfiguration);
  } catch (e) {
    console.log(e);
  }
}
