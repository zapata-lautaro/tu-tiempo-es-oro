import { Currency } from './currency.enum';

export class DolarConvertion {
  updatedOn: number;
  bid: number;
  ask: number;
}

export interface StorageData {
  dolarConvertion: DolarConvertion;
  usdSalary: number;
  pesosSalary: number;
  currency: Currency;
  hoursPerMonth: number;
  hoursPerLaboralDay: number;
}
