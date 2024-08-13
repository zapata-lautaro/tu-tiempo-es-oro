import { Currency } from './currency.enum';
import { DolarConvertion, DolarConvertionProps } from './dolar-convertion';
import { JobInformation, JobInformationProps } from './job-information';

export interface StorageDataProps {
  dolarConvertion: DolarConvertionProps;
  jobInformation: JobInformationProps;
}

export class StorageData implements StorageDataProps {
  private constructor(
    public dolarConvertion: DolarConvertion,
    public jobInformation: JobInformation,
  ) {}

  public static fromJson(json: StorageDataProps) {
    return new StorageData(
      DolarConvertion.fromJson(json.dolarConvertion),
      JobInformation.fromJson(json.jobInformation),
    );
  }

  public IsDolarConvertionOutdated(now: Date) {
    return this.dolarConvertion.IsOutdated(now);
  }

  public updateSalary(salary: number, currency: Currency) {
    this.jobInformation.usdSalary =
      currency == Currency.USD
        ? salary
        : this.dolarConvertion.convertToUsd(salary);
    this.jobInformation.pesosSalary =
      currency == Currency.ARS
        ? salary
        : this.dolarConvertion.convertToArs(salary);
    this.jobInformation.currency = currency;
  }

  public updateLaboralDaysInformation(
    hoursPerDay: number,
    daysPerWeek: number,
  ) {
    this.jobInformation.hoursPerLaboralDay = hoursPerDay;
    this.jobInformation.laboralDaysPerWeek = daysPerWeek;
  }

  public updateDolarConvertion(dolarConvertionProps: DolarConvertionProps) {
    this.dolarConvertion.ask = dolarConvertionProps.ask;
    this.dolarConvertion.bid = dolarConvertionProps.bid;
    this.dolarConvertion.updatedOn = dolarConvertionProps.updatedOn;

    this.updateSalary(
      this.jobInformation.salaryInOriginalCurrency(),
      this.jobInformation.currency,
    );
  }
}
