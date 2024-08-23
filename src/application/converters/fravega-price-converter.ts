import { Currency } from '../../models/currency.enum';
import { PriceConverter, PriceSelector } from './price-converter';

const PRICE_VALUE_SELECTORS: PriceSelector[] = [
  {
    selector:
      'div[data-test-id="product-price"] span:not([data-test-id="discount-tag"])',
    includeSymbol: true,
  },
  {
    selector: 'div[data-test-id="price-wrapper"] span:not(:nth-child(3))',
    includeSymbol: true,
  },
];

export class FravegaPriceConverter extends PriceConverter {
  constructor(document: Document) {
    super(document, PRICE_VALUE_SELECTORS, [], [], Currency.ARS);
  }
}
