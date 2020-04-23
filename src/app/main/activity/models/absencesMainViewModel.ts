import { Department } from '../../../common/models/department';
import { Employee } from '../../../common/models/employee';
import { AbsenceType } from './absenceType';

export class AbsencesMainViewModel {
  employees: Employee[];
  activityAbsenceTypes: AbsenceType[];
  departments: Department[];
  startDate: Date | string;
  endDate: Date | string;
  departmentId: number;
}
