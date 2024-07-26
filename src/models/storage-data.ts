import { DolarConvertion, DolarConvertionProps } from './dolar-convertion';
import { JobInformation, JobInformationProps } from './job-information';

export interface StorageDataProps {
  dolarConvertion: DolarConvertionProps;
  jobInformation: JobInformationProps;
}

export class StorageData implements StorageDataProps {
  private constructor(
    public dolarConvertion: DolarConvertion,
    public jobInformation: JobInformation,
  ) {}

  public static fromJson(json: StorageDataProps) {
    return new StorageData(
      DolarConvertion.fromJson(json.dolarConvertion),
      JobInformation.fromJson(json.jobInformation),
    );
  }
}
