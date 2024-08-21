import { JobInformation } from '../../models/job-information';

export const TIME_SYMBOL = `⏱️`;
export const ORIGINAL_VALUE_ATTRIBUTE = 'data-original-value';
export const CONVERTED_TAG = 'converted';
export const HIDE_CLASS = 'time-convertion-hide';

export interface PriceConverter {
  convert(jobInformation: JobInformation): Promise<void>;
  revert(): Promise<void>;
}
