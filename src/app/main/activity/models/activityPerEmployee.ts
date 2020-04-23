import { Employee } from '../../../common/models/employee';
import { ActivityPerWeek } from './activityPerWeek';

export class ActivityPerEmployee {
  employee: Employee;
  activitiesPerWeek: ActivityPerWeek[];
}
