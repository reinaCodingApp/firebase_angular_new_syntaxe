import { Department } from '../../../common/models/department';
import { Site } from '../../../common/models/site';
import { BonusCategory } from './bonusCategory';
import { ReplacementBonusCategory } from './replacementBonusCategory';
import { AbsenceType } from './absenceType';
import { Employee } from '../../../common/models/employee';
import { Provider } from './provider';
import { CompleteEmployee } from './completeEmployee';
import { ActivityPerEmployee } from './activityPerEmployee';
import { Month } from 'app/main/foreign-mission/models/month';

export class ActivityManageViewModel {
  departments: Department[];
  allEmployees: CompleteEmployee[];
  orderedActivities: ActivityPerEmployee[];
  sites: Site[];
  sectorSites: Site[];
  bonusCategories: BonusCategory[];
  replacementBonusCategories: ReplacementBonusCategory[];
  defaultStartDate: string;
  defaultEndDate: string;
  currentDateString: string;
  isAdmin: boolean;
  isTemporaryWorker: boolean;
  isRhAdmin: boolean;
  providers: Provider[];
  absenceTypes: AbsenceType[];
  years: number[];

  possibleYears: number[];
  months: Month[];
}
