import { Currency } from './currency.enum';

export interface JobInformationProps {
  hoursPerMonth: number;
  hoursPerLaboralDay: number;
  salary: number;
  currency: Currency;
}

export class JobInformation implements JobInformationProps {
  constructor(
    public hoursPerMonth: number,
    public hoursPerLaboralDay: number,
    public salary: number,
    public currency: Currency,
  ) {}

  public static fromJson(json: JobInformationProps): JobInformation {
    return new JobInformation(
      json.hoursPerMonth,
      json.hoursPerLaboralDay,
      json.salary,
      json.currency,
    );
  }

  public anualSalary(): number {
    return this.salary * 12;
  }

  public monthlySalary(): number {
    return this.salary;
  }

  public weeklySalary(): number {
    return this.salary / 4;
  }

  public dailySalary(): number {
    return (this.salary / this.hoursPerMonth) * this.hoursPerLaboralDay;
  }

  public hourlySalary(): number {
    return this.salary / this.hoursPerMonth;
  }

  public perMinuteSalary(): number {
    return this.hourlySalary() / 60;
  }
}
