import { getStorageData, setStorageData } from '../application/storage-service';
import { debounce } from '../application/utils';
import { Currency } from '../models/currency.enum';
import { StorageData } from '../models/storage-data';

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

salaryInput.oninput = currencySelect.onchange = debounce(handleSalaryChange);
hoursPerDayInput.oninput = daysPerWeekInput.onchange = debounce(
  handleLaboralDaysChange,
);
document.body.onload = setFormValuesFromStorage;

async function setFormValuesFromStorage() {
  const storageData = await getStorageData();
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

async function handleSalaryChange() {
  const salary = +salaryInput.value;
  const currency = currencySelect.value;

  try {
    const storageData = await getStorageData();

    storageData.updateSalary(salary, currency as Currency);

    await setStorageData(storageData);
    await notifyPopupChange(storageData);
  } catch (e) {
    console.log(e);
  }
}

async function handleLaboralDaysChange() {
  const hoursPerDay = +hoursPerDayInput.value;
  const daysPerWeek = +daysPerWeekInput.value;

  try {
    const storageData = await getStorageData();

    storageData.updateLaboralDaysInformation(hoursPerDay, daysPerWeek);

    await setStorageData(storageData);
    await notifyPopupChange(storageData);
  } catch (e) {
    console.log(e);
  }
}

async function notifyPopupChange(storageData: StorageData) {
  console.log('notifyPopupChange');
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  await chrome.tabs.sendMessage(tab.id, { storageData });
}
