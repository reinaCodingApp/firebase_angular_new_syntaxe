import { Employee } from '../../../common/models/employee';
import { Department } from '../../webcms/models/department';
import { AdvanceSalaryStatus } from './advanceSalaryStatus';
import { Advance } from './advance';

export class HumanRessourcesViewModel {
  employees: Employee[];
  departments: Department;
  advanceSalariesStatus: AdvanceSalaryStatus[];
  advanceSalaries: Advance[];
  startDate: Date;
  endDate: Date;
  canManipulateAdvanceSalary: boolean;
}
