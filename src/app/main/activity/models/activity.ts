import { Employee } from 'app/common/models/employee';
import { Site } from '../../../common/models/site';
import { BonusCategory } from './bonusCategory';
import { ReplacementBonusCategory } from './replacementBonusCategory';
import { Break } from './break';
import { AbsenceType } from './absenceType';
import { ActivityType } from './activityType';
import { ActivityState } from './activityState';

export class Activity {
  constructor() {
    this.employee = new Employee();
    this.site = new Site();
  }
  id?: number;
  title: string;
  day?: string | any;
  startDate: string | any;
  endDate?: string;
  startTime: string | any;
  endTime: string | any;
  employee: Employee;
  site: Site | any;
  bonusCategory?: BonusCategory;
  replacementBonusCategory?: ReplacementBonusCategory;
  bonusString?: string;
  breaks?: Break[];
  activityType?: ActivityType;
  absenceType?: AbsenceType;
  activityState?: ActivityState;
  manuallyCreated?: boolean;
  totalWorkedTimeMinutes?: number;
  totalWorkedTimeString?: string;
  totalBreakTimeMinutes?: number;
  totalBreakTimeString?: string;
  weekNumber?: number;
  year?: number;
  breaksString?: string;
  isTemporaryWorker?: boolean;
  providerName?: string;
  acceptsEdition?: boolean;
  dayLong?: number;
  startTimeLong?: number;
  endTimeLong?: number;
  dayCounter?: number;
}
