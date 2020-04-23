import { EmployeePreference } from './employeePreference';
import { CompleteEmployee } from '../../activity/models/completeEmployee';

export class EmployeesWithDepartments {
  employees: CompleteEmployee[];
  preferences: EmployeePreference[];
}
