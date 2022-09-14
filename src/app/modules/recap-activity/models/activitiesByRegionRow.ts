import { Site } from '../../../common/models/site';
import { Activity } from '../../activity/models/activity';

export class ActivitiesByRegionRow {
  site: Site;
  mondayActivities: Activity[];
  tuesdayActivities: Activity[];
  wednesdayActivities: Activity[];
  thursdayActivities: Activity[];
  fridayActivities: Activity[];
  saturdayActivities: Activity[];
  sundayActivities: Activity[];
}
