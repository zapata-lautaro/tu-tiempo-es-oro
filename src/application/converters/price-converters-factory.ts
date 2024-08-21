import { FravegaPriceConverter } from './fravega-price-converter';
import { GarbarinoPriceConverter } from './garbarino-price-converter';
import { MeliPriceConverter } from './meli-price-converter';
import { PriceConverter } from './price-converter.interface';

const MELI_KEY = 'meli';
const MELI_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?mercadolibre\.com\.ar(\/.*)?/;
const GARBARINO_KEY = 'meli';
const GARBARINO_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?garbarino\.com(\/.*)?/;
const FRAVEGA_KEY = 'fravega';
const FRAVEGA_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?fravega\.com(\/.*)?/;

type ConverterFactory = (document: Document) => PriceConverter;

interface ConverterEntry {
  key: string;
  matchDomain: (domain: string) => boolean;
  factory: ConverterFactory;
}

const converters: ConverterEntry[] = [
  {
    key: MELI_KEY,
    matchDomain: (domain: string) => MELI_DOMAIN_REGEX.test(domain),
    factory: (document) => new MeliPriceConverter(document),
  },
  {
    key: GARBARINO_KEY,
    matchDomain: (domain: string) => GARBARINO_DOMAIN_REGEX.test(domain),
    factory: (document) => new GarbarinoPriceConverter(document),
  },
  {
    key: FRAVEGA_KEY,
    matchDomain: (domain: string) => FRAVEGA_DOMAIN_REGEX.test(domain),
    factory: (document) => new FravegaPriceConverter(document),
  },
];

export function getConverterForDomain(
  domain: string,
  document: Document,
): PriceConverter | null {
  const entry = converters.find((entry) => entry.matchDomain(domain));
  return entry ? entry.factory(document) : null;
}

export function getKeyForDomain(domain: string): string | null {
  const entry = converters.find((entry) => entry.matchDomain(domain));
  return entry ? entry.key : null;
}
