import { Currency } from './currency.enum';
import { TimeConvertion } from './time-convertion';

export interface JobInformationProps {
  laboralDaysPerWeek: number;
  hoursPerLaboralDay: number;
  currency: Currency;
  usdSalary: number;
  pesosSalary: number;
}

export class JobInformation implements JobInformationProps {
  static readonly LABORAL_WEEKS = 4;
  static readonly LABORAL_MONTHS = 12;
  static readonly MINUTES_PER_HOUR = 60;

  constructor(
    public laboralDaysPerWeek: number,
    public hoursPerLaboralDay: number,
    public currency: Currency,
    public pesosSalary: number,
    public usdSalary: number,
  ) {}

  public static fromJson(json: JobInformationProps): JobInformation {
    return new JobInformation(
      json.laboralDaysPerWeek,
      json.hoursPerLaboralDay,
      json.currency,
      json.pesosSalary,
      json.usdSalary,
    );
  }

  get hoursPerMonth(): number {
    return (
      this.hoursPerLaboralDay *
      this.laboralDaysPerWeek *
      JobInformation.LABORAL_WEEKS
    );
  }

  public hasMissingData(): boolean {
    return (
      this.salaryInOriginalCurrency() == 0 ||
      this.laboralDaysPerWeek == 0 ||
      this.hoursPerLaboralDay == 0
    );
  }

  public salaryInOriginalCurrency(): number {
    return this.salaryInCurrency(this.currency);
  }

  private salaryInCurrency(currency: Currency): number {
    return currency == Currency.ARS ? this.pesosSalary : this.usdSalary;
  }

  private anualSalary(currency: Currency): number {
    return this.salaryInCurrency(currency) * JobInformation.LABORAL_MONTHS;
  }

  private monthlySalary(currency: Currency): number {
    return this.salaryInCurrency(currency);
  }

  private weeklySalary(currency: Currency): number {
    return this.salaryInCurrency(currency) / JobInformation.LABORAL_WEEKS;
  }

  private dailySalary(currency: Currency): number {
    return (
      (this.salaryInCurrency(currency) / this.hoursPerMonth) *
      this.hoursPerLaboralDay
    );
  }

  private hourlySalary(currency: Currency): number {
    return this.salaryInCurrency(currency) / this.hoursPerMonth;
  }

  private perMinuteSalary(currency: Currency): number {
    return this.hourlySalary(currency) / JobInformation.MINUTES_PER_HOUR;
  }

  public getTimeConvertion(price: number, currency: Currency): TimeConvertion {
    const years = Math.floor(price / this.anualSalary(currency));
    let remainingPrice = price % this.anualSalary(currency);

    const months = Math.floor(remainingPrice / this.monthlySalary(currency));
    remainingPrice = remainingPrice % this.monthlySalary(currency);

    const weeks = Math.floor(remainingPrice / this.weeklySalary(currency));
    remainingPrice = remainingPrice % this.weeklySalary(currency);

    const days = Math.floor(remainingPrice / this.dailySalary(currency));
    remainingPrice = remainingPrice % this.dailySalary(currency);

    const hours = Math.floor(remainingPrice / this.hourlySalary(currency));
    remainingPrice = remainingPrice % this.hourlySalary(currency);

    const minutes = Math.ceil(remainingPrice / this.perMinuteSalary(currency));

    return new TimeConvertion(years, months, weeks, days, hours, minutes);
  }
}
