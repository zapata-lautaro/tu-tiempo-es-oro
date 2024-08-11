import { DolarConvertionProps } from '../models/dolar-convertion';
import { getStorageData, setStorageData } from './storage-service';

const dolarApiUrl = 'https://dolarapi.com/v1/dolares/blue';

async function getDolarPriceFromApi() {
  const response = await fetch(dolarApiUrl);
  const jsonResponse = await response.json();

  return {
    ask: jsonResponse.venta,
    bid: jsonResponse.compra,
  };
}

export async function getConversion(): Promise<DolarConvertionProps> {
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

    if (!storageData.IsDolarConvertionOutdated(new Date())) {
      return;
    }

    storageData.updateDolarConvertion(await getConversion());

    return setStorageData(storageData);
  } catch (e) {
    console.log(e);
  }
}
