import { AmazonPriceConverter } from '../../../src/application/converters/amazon-price-converter';
import { FravegaPriceConverter } from '../../../src/application/converters/fravega-price-converter';
import { GarbarinoPriceConverter } from '../../../src/application/converters/garbarino-price-converter';
import { MeliPriceConverter } from '../../../src/application/converters/meli-price-converter';
import { MusimundoPriceConverter } from '../../../src/application/converters/musimundo-price-converter';
import { getConverterForDomain } from '../../../src/application/converters/price-converters-factory';

describe('getConverterForDomain ', () => {
  const validDomains: {
    domain: string;
    expcetedConverter: string | null;
  }[] = [
    {
      domain: 'https://mercadolibre.com.ar/something',
      expcetedConverter: MeliPriceConverter.name,
    },
    {
      domain: 'https://mercadolibre.com.ar',
      expcetedConverter: MeliPriceConverter.name,
    },
    {
      domain: 'https://subdomain.mercadolibre.com.ar',
      expcetedConverter: MeliPriceConverter.name,
    },
    {
      domain: 'https://somesubdomain.garbarino.com/someurl',
      expcetedConverter: GarbarinoPriceConverter.name,
    },
    {
      domain: 'https://somesubdomain.fravega.com/someurl',
      expcetedConverter: FravegaPriceConverter.name,
    },
    {
      domain: 'https://somesubdomain.musimundo.com/someurl',
      expcetedConverter: MusimundoPriceConverter.name,
    },
    {
      domain: 'https://somesubdomain.amazon.com/someurl',
      expcetedConverter: AmazonPriceConverter.name,
    },
  ];

  describe.each(validDomains)('A convertion', (params) => {
    it(`with domain ${params.domain} should return ${params.expcetedConverter}`, () => {
      const result = getConverterForDomain(params.domain, {} as Document);
      const resultClassName = result.constructor.name;

      expect(resultClassName).toEqual(params.expcetedConverter);
    });
  });

  const invalidDomains: string[] = [
    'https://unsupporteddomain.com',
    'http://mercadolibre.com.ar',
    'https://amazon.es',
    'garbarino.com',
  ];

  describe.each(invalidDomains)('A convertion', (domain) => {
    it(`with domain ${domain} should return null`, () => {
      const result = getConverterForDomain(domain, {} as Document);

      expect(result).toBeNull();
    });
  });
});
