export interface PriceConverter {
  convert(): void;
  revert(): void;
}
