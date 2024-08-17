export interface DomainConfigurationProps {
  key: string;
  convertionEnabled: boolean;
}

export class DomainConfiguration implements DomainConfigurationProps {
  constructor(
    public key: string,
    public convertionEnabled: boolean,
  ) {}

  public static fromJson(props: DomainConfigurationProps): DomainConfiguration {
    return new DomainConfiguration(props.key, props.convertionEnabled);
  }

  public enable(value: boolean) {
    this.convertionEnabled = value;
  }
}
