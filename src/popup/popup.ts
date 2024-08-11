import { getStorageData, setStorageData } from '../application/storage-service';
import { debounce } from '../application/utils';
import { Currency } from '../models/currency.enum';

const salaryInput = document.getElementById('salary')! as HTMLInputElement;
const currencySelect = document.getElementById(
  'currency',
)! as HTMLSelectElement;

salaryInput.oninput = currencySelect.onchange = debounce(handleSalaryChange);
document.body.onload = setFormValuesFromStorage;

async function setFormValuesFromStorage() {
  const storageData = await getStorageData();
  salaryInput.value = storageData.jobInformation
    .salaryInOriginalCurrency()
    .toString();
  currencySelect.value = storageData.jobInformation.currency;
}

async function handleSalaryChange() {
  const salary = +salaryInput.value;
  const currency = currencySelect.value;

  try {
    const storageData = await getStorageData();

    storageData.updateSalary(salary, currency as Currency);

    setStorageData(storageData);
  } catch (e) {
    console.log(e);
  }
}
