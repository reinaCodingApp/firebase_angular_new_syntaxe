import { EmployeeLevel } from './employeeLevel';
import { Employee } from '../../../common/models/employee';
import { Sheet } from './sheet';
import { Pole } from './pole';

export class FollowupSheetViewModel {
  connectedEmployeeLevel: EmployeeLevel;
  sheet: Sheet;
  followupSheetAlreadySubmitted: boolean;
  employees: Employee[];
  canEdit: boolean;
  poles: Pole[];
  sheetsHistory: Sheet[];
}
