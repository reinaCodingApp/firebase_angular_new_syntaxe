import { Department } from '../../../common/models/department';
import { Site } from '../../../common/models/site';
import { ActivitiesByRegionRow } from './activitiesByRegionRow';

export class ActivitiesByRegionViewModel {
  departments: Department[];
  sites: Site[];
  activitiesByRegionRows: ActivitiesByRegionRow[];
  selectedDepartmentId: number;
}
