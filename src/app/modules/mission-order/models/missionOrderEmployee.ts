import { Employee } from '../../../common/models/employee';

export class MissionOrderEmployee {
  id: number;
  employee: Employee;
  start: Date | string;
  end: Date | string;
  daysWork: number;
}
