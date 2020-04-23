import { Department } from '../../../common/models/department';
import { Month } from '../../foreign-mission/models/month';

export class StatisticsViewModel {
  departements: Department[];
  possibleYears: number[];
  months: Month[];
  canUserGeneratePaieForMonth: boolean;
}
