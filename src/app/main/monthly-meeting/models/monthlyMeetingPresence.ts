import { Employee } from 'app/common/models/employee';

export class MonthlyMeetingPresence {
  constructor() {
    this.employee = new Employee();
  }
  id: number;
  monthlyMeetingId: number;
  employee: Employee;
  employeeId: number;
  start: Date | string | null;
  end: Date | string | null;
  startTimeStr: string;
  EndTimeStr: string;
  startDateStr: string;
  endDateStr: string;
  meal: boolean;
  observations: string;
  justifiedAbsence: boolean;
  defaultDepartment: string;
}
