import { DolarConvertion } from '../models/dolar-convertion';
import { getStorageData, setStorageData } from './storage-service';

async function getDolarPriceFromApi() {
  const response = await fetch('https://dolarapi.com/v1/dolares/blue');
  const jsonResponse = await response.json();

  return {
    ask: jsonResponse.venta,
    bid: jsonResponse.compra,
  };
}

export async function getConversion(): Promise<DolarConvertion> {
  const { bid, ask } = await getDolarPriceFromApi();
  return {
    updatedOn: Date.now(),
    bid,
    ask,
  };
}

export default async function updateDolarConvertionIfOutdated(): Promise<void> {
  try {
    const storageData = await getStorageData();

    if (
      Object.prototype.hasOwnProperty.call(storageData, 'dolarConvertion') &&
      new Date().getDate() ==
        new Date(storageData.dolarConvertion.updatedOn).getDate()
    ) {
      return;
    }

    const updatedConvertion = await getConversion();
    storageData.dolarConvertion = updatedConvertion;

    return setStorageData(storageData);
  } catch (e) {
    console.log(e);
  }
}
