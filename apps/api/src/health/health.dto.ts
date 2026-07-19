import { ResponseProperty } from '@decorator';
export class HealthReponse {
  @ResponseProperty('OK') readonly status: string;
  constructor(status: string) {
    this.status = status;
  }
}
