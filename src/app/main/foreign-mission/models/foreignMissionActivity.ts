import { Site } from '../../../common/models/site';
import { Employee } from '../../../common/models/employee';

export class ForeignMissionActivity {
  constructor() {
    this.employee = new Employee();
    this.site = new Site();
  }
  id: number;
  employee: Employee;
  site: Site;
  departingDate: string;
  returningDate: string;
}
