const SINGULAR_LABELS: string[] = [
  'Año',
  'Mes',
  'Semana',
  'Día',
  'Hora',
  'Minuto',
];
const PLURAL_LABELS: string[] = [
  'Años',
  'Meses',
  'Semanas',
  'Días',
  'Horas',
  'Minutos',
];

export class PriceConvertion {
  constructor(
    private years: number,
    private months: number,
    private weeks: number,
    private days: number,
    private hours: number,
    private minutes: number,
  ) {}

  public toShortStringRepresentation(): string {
    const timeValues = [
      this.years,
      this.months,
      this.weeks,
      this.days,
      this.hours,
      this.minutes,
    ];
    for (let i = 0; i < timeValues.length; i++) {
      if (timeValues[i] == 0) continue;

      let stringRepresentation = `${timeValues[i]} ${timeValues[i] > 1 ? PLURAL_LABELS[i] : SINGULAR_LABELS[i]}`;

      const finalTimeValue = i == timeValues.length;
      if (!finalTimeValue && timeValues.slice(i + 1).some((t) => t > 0)) {
        stringRepresentation = '+' + stringRepresentation;
      }

      return stringRepresentation;
    }
  }

  public toFullStringRepresentation(): string {
    const timeValues = [
      this.years,
      this.months,
      this.weeks,
      this.days,
      this.hours,
      this.minutes,
    ];
    let stringRepresentationChunks = [];
    for (let i = 0; i < timeValues.length; i++) {
      if (timeValues[i] == 0) continue;

      stringRepresentationChunks.push(
        `${timeValues[i]} ${timeValues[i] > 1 ? PLURAL_LABELS[i] : SINGULAR_LABELS[i]}`,
      );
    }

    return stringRepresentationChunks.join(' ');
  }
}
