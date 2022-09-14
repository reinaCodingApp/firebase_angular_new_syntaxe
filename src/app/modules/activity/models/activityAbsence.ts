import { AbsenceType } from './absenceType';
import { Employee } from 'app/common/models/employee';

export class ActivityAbsence {
  constructor() {
    this.employee = new Employee();
    this.absenceType = new AbsenceType();
  }
  id: number;
  employee: Employee;
  startDate: string;
  startTime: number;
  endDate: string;
  endTime: number;
  absenceType: AbsenceType;
}
