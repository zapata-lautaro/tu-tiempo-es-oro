import { describe, expect } from '@jest/globals';
import { TimeConvertion } from '../../src/models/time-convertion';

describe('toFullStringRepresentation ', () => {
  it('Should print all time types with singular labels', () => {
    const givenTimeConvertion = new TimeConvertion(1, 1, 1, 1, 1, 1);

    expect(givenTimeConvertion.toFullStringRepresentation()).toBe(
      '1 Año 1 Mes 1 Semana 1 Día 1 Hora 1 Minuto',
    );
  });

  it('Should print all time types with plural labels', () => {
    const givenTimeConvertion = new TimeConvertion(2, 3, 4, 5, 6, 7);

    expect(givenTimeConvertion.toFullStringRepresentation()).toBe(
      '2 Años 3 Meses 4 Semanas 5 Días 6 Horas 7 Minutos',
    );
  });

  it('Should print only time types with values', () => {
    const givenTimeConvertion = new TimeConvertion(0, 0, 1, 0, 0, 0);

    expect(givenTimeConvertion.toFullStringRepresentation()).toBe('1 Semana');
  });
});

describe('toShortStringRepresentation ', () => {
  it('Should print without plus sign when only 1 time type', () => {
    const givenTimeConvertion = new TimeConvertion(1, 0, 0, 0, 0, 0);

    expect(givenTimeConvertion.toShortStringRepresentation()).toBe('1 Año');
  });

  it('Should print with plus sign when more than 1 time type', () => {
    const givenTimeConvertion = new TimeConvertion(1, 0, 0, 1, 0, 0);

    expect(givenTimeConvertion.toShortStringRepresentation()).toBe('+1 Año');
  });

  it('Should print with plural label', () => {
    const givenTimeConvertion = new TimeConvertion(5, 0, 0, 0, 0, 0);

    expect(givenTimeConvertion.toShortStringRepresentation()).toBe('5 Años');
  });
});
