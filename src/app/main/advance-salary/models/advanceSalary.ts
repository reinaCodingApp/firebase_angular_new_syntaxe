import { AdvanceSalaryStatus } from './advanceSalaryStatus';

export class AdvanceSalary {
  requestDate: Date;
  requestValidationDate: Date;
  requestTransfertDate: Date;
  requestAmount: number;
  requestAwarded: number;
  observations: string;
  employee: any;
  employeeId: number;
  advanceSalaryStatus: AdvanceSalaryStatus;
  advanceSalaryStatusId: number;
}
