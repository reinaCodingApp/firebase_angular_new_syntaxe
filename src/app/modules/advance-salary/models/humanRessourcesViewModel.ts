import { Employee } from '../../../common/models/employee';
import { AdvanceSalaryStatus } from './advanceSalaryStatus';
import { Advance } from './advance';
import { Department } from 'app/common/models/department';

export class HumanRessourcesViewModel {
  employees: Employee[];
  departments: Department;
  advanceSalariesStatus: AdvanceSalaryStatus[];
  advanceSalaries: Advance[];
  startDate: Date;
  endDate: Date;
  canManipulateAdvanceSalary: boolean;
}
