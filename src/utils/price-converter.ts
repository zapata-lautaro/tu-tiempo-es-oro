export default class PriceConverter {
  private _salary :  number;
  private _hoursPerMonth :  number;
  private _hoursPerLaboralDay :  number;

  constructor(
    salary: number, 
    hoursPerMonth: number, 
    hoursPerLaboralDay: number) {
      this._salary = salary;
      this._hoursPerMonth = hoursPerMonth;
      this._hoursPerLaboralDay = hoursPerLaboralDay;
  }

  public getStringRepresentation(price: number) {
    let years = price / (this._salary * 12);
  
    if(Math.floor(years) > 0) {
      years = Math.round(years);
      return `${years} año${years > 1 ? 's' : ''}`;
    }
  
    let months = price / this._salary;
  
    if(Math.floor(months) > 0) {
      months = Math.round(months);
      return `${months} mes${months > 1 ? 'es' : ''}`;
    }
  
    let days = price / (this._salary / this._hoursPerMonth * this._hoursPerLaboralDay);
  
    if(Math.floor(days) > 0) {
      days = Math.round(days);
      return `${days} día${days > 1 ? 's' : ''}`;
    }
  
    let hours = price / (this._salary / this._hoursPerMonth);
  
    if(Math.floor(hours) > 0) {
      hours = Math.round(hours);
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }

    return '-1 hora';
  }
}