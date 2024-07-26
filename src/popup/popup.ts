import { debounce } from '../application/utils';

const FALLBACK_DOLAR_BID = 1400;
const FALLBACK_DOLAR_ASK = 1450;

const salaryInput = document.getElementById('salary')! as HTMLInputElement;
const currencySelect = document.getElementById(
  'currency',
)! as HTMLSelectElement;

salaryInput.oninput = currencySelect.onchange = debounce(handleSalaryChange);

document.body.onload = () => {
  chrome.storage.sync.get().then((storage) => {
    if (storage.usdSalary && storage.currency) {
      salaryInput.value =
        storage.currency == 'USD' ? storage.usdSalary : storage.pesosSalary;
      currencySelect.value = storage.currency;
    }
  });
};

async function handleSalaryChange() {
  const salary = +salaryInput.value;
  const currency = currencySelect.value;

  console.log({ salary, currency });

  try {
    const storage = await chrome.storage.sync.get();
    const bid = storage.dolarConvertion?.bid ?? FALLBACK_DOLAR_BID;
    const ask = storage.dolarConvertion?.ask ?? FALLBACK_DOLAR_ASK;

    await chrome.storage.sync.set({
      usdSalary: currency == 'USD' ? salary : roundMoney(salary / ask),
      pesosSalary: currency == 'ARS' ? salary : roundMoney(salary * bid),
      currency,
    });
  } catch (e) {
    console.log(e);
  }
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
