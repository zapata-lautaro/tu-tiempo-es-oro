import { AmazonPriceConverter } from './amazon-price-converter';
import { FravegaPriceConverter } from './fravega-price-converter';
import { GarbarinoPriceConverter } from './garbarino-price-converter';
import { MeliPriceConverter } from './meli-price-converter';
import { MusimundoPriceConverter } from './musimundo-price-converter';
import { PriceConverter } from './price-converter';

const MELI_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?mercadolibre\.com\.ar(\/.*)?/;
const GARBARINO_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?garbarino\.com(\/.*)?/;
const FRAVEGA_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?fravega\.com(\/.*)?/;
const MUSIMUNDO_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?musimundo\.com(\/.*)?/;
const AMAZON_DOMAIN_REGEX = /^https:\/\/([^.]+\.)?amazon\.com(\/.*)?/;

type ConverterFactory = (document: Document) => PriceConverter;

interface ConverterEntry {
  key: string;
  matchDomain: (domain: string) => boolean;
  factory: ConverterFactory;
}

const converters: ConverterEntry[] = [
  {
    key: MeliPriceConverter.name,
    matchDomain: (domain: string) => MELI_DOMAIN_REGEX.test(domain),
    factory: (document) => new MeliPriceConverter(document),
  },
  {
    key: GarbarinoPriceConverter.name,
    matchDomain: (domain: string) => GARBARINO_DOMAIN_REGEX.test(domain),
    factory: (document) => new GarbarinoPriceConverter(document),
  },
  {
    key: FravegaPriceConverter.name,
    matchDomain: (domain: string) => FRAVEGA_DOMAIN_REGEX.test(domain),
    factory: (document) => new FravegaPriceConverter(document),
  },
  {
    key: MusimundoPriceConverter.name,
    matchDomain: (domain: string) => MUSIMUNDO_DOMAIN_REGEX.test(domain),
    factory: (document) => new MusimundoPriceConverter(document),
  },
  {
    key: AmazonPriceConverter.name,
    matchDomain: (domain: string) => AMAZON_DOMAIN_REGEX.test(domain),
    factory: (document) => new AmazonPriceConverter(document),
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
