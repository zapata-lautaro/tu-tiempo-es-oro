export interface DolarConvertionProps {
  updatedOn: number;
  bid: number;
  ask: number;
}

export class DolarConvertion implements DolarConvertionProps {
  constructor(
    public updatedOn: number,
    public bid: number,
    public ask: number,
  ) {}

  public static fromJson(json: DolarConvertionProps): DolarConvertion {
    return new DolarConvertion(json.updatedOn, json.bid, json.ask);
  }

  public IsOutdated(now: Date) {
    return now.getDate() != new Date(this.updatedOn).getDate();
  }

  public convertToUsd(pesos: number): number {
    return pesos / this.ask;
  }

  public convertToArs(usd: number): number {
    return usd * this.bid;
  }
}
