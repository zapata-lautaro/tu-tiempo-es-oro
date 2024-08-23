import {
  PriceConverter,
  PriceSelector,
} from '../../src/application/converters/price-converter';
import { Currency } from '../../src/models/currency.enum';

export class FakePriceConverter extends PriceConverter {
  constructor(
    document: Document,
    priceValueSelectors: PriceSelector[],
    priceSymbolSelectors: string[],
    centsSelectors: string[],
    defaultCurrency: Currency,
    decimalSeparator: string,
  ) {
    super(
      document,
      priceValueSelectors,
      priceSymbolSelectors,
      centsSelectors,
      defaultCurrency,
      decimalSeparator,
    );
  }
}
