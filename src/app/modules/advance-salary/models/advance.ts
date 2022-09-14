import { AdvanceSalaryStatus } from './advanceSalaryStatus';
import { Employee } from '../../../common/models/employee';

export class Advance {
  id: number;
  constructor() {
    this.employee = new Employee();
  }
  requestDate: Date;
  requestValidationDate: Date;
  requestTransfertDate: Date;
  requestAmount: number;
  requestAwarded: number;
  observations: string;
  employee: Employee;
  advanceSalaryStatus: AdvanceSalaryStatus;
  advanceSalaryStatusId: number;
}
