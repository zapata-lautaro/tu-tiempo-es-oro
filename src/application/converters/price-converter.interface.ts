import { JobInformation } from '../../models/job-information';

export interface PriceConverter {
  convert(jobInformation: JobInformation): void;
  revert(): void;
}
