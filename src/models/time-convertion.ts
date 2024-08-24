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

export class TimeConvertion {
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
    const stringRepresentationChunks = [];
    for (let i = 0; i < timeValues.length; i++) {
      if (timeValues[i] == 0) continue;

      stringRepresentationChunks.push(
        `${timeValues[i]} ${timeValues[i] > 1 ? PLURAL_LABELS[i] : SINGULAR_LABELS[i]}`,
      );
    }

    if (stringRepresentationChunks.length == 1) {
      return stringRepresentationChunks[0];
    }

    return `${stringRepresentationChunks.slice(0, -1).join(', ')} y ${stringRepresentationChunks.slice(-1)}`;
  }
}
