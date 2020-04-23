import { Employee } from '../../../common/models/employee';

export class EmployeeLevel {
  constructor() {
    this.employee = new Employee();
    this.responsible = new Employee();
  }

  id: number;
  employee: Employee;
  responsible: Employee;
  hierarchyLevel: number;
  isActive: boolean;
  isCodirWriter: boolean;
  sectionDefaultTitle: string;
  isCodirMember: boolean;
  isSuperAdmin: boolean;
  profileNumber: number;
}
