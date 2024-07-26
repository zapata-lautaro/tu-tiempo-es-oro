import { JobInformation } from '../models/job-information';
import { PriceConvertion } from '../models/price-convertion';

export default class PriceConverter {
  constructor(private _jobInformation: JobInformation) {}

  public getConvertion(price: number): PriceConvertion {
    const years = Math.floor(price / this._jobInformation.anualSalary());
    let remainingPrice = price % this._jobInformation.anualSalary();

    const months = Math.floor(price / this._jobInformation.monthlySalary());
    remainingPrice -= price % this._jobInformation.monthlySalary();

    const weeks = Math.floor(price / this._jobInformation.weeklySalary());
    remainingPrice -= price % this._jobInformation.weeklySalary();

    const days = Math.floor(price / this._jobInformation.dailySalary());
    remainingPrice -= price % this._jobInformation.dailySalary();

    const hours = Math.floor(price / this._jobInformation.hourlySalary());
    remainingPrice -= price % this._jobInformation.hourlySalary();

    const minutes = Math.ceil(price / this._jobInformation.perMinuteSalary());

    return new PriceConvertion(years, months, weeks, days, hours, minutes);
  }
}
