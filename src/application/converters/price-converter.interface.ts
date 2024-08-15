import { JobInformation } from '../../models/job-information';

export interface PriceConverter {
  convert(jobInformation: JobInformation): Promise<void>;
  revert(): Promise<void>;
}
