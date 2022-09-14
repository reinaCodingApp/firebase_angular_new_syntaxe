import { Employee } from '../../../common/models/employee';

export class ExecutiveEmployee extends Employee {
  profileNumber: number;
  presenceCounter: number;
  holidaysCounter: number;
}
