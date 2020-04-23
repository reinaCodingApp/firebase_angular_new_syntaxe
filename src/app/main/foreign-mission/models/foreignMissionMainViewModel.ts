import { Employee } from '../../../common/models/employee';
import { Site } from '../../../common/models/site';
import { Month } from './month';

export class ForeignMissionMainViewModel {
  employees: Employee[];
  sites: Site[];
  possibleYears: number[];
  months: Month[];
}
