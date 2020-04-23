import { Activity } from '../../activity/models/activity';
import { WeekStats } from './weekStats';
import { CheckedCode } from '../../traceability/models/checkedCode';
import { TourSheetActivityRow } from './tourSheetActivityRow';

export class TourSheetActivityList {
  checkedCodes: CheckedCode[];
  weekActivities: Activity[];
  weekStats: WeekStats;
  weekActivitiesRoadMapViewModelRows: TourSheetActivityRow[];
  startDate: Date | string;
  endDate: Date | string;
}
