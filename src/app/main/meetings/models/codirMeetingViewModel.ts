import { SmallSheet } from '../../followup-sheet/models/smallSheet';
import { EmployeeLevel } from '../../followup-sheet/models/employeeLevel';
import { MeetingSector } from './meetingSector';
import { MeetInstance } from './meetInstance';
import { MeetingtPole } from './meetingPole';

export class CodirMeetingViewModel {
  codirDate: string;
  weekNumber: number;
  poles: MeetingtPole[];
  connectedEmployeeLevel: EmployeeLevel;
  codirEmployees: EmployeeLevel[];
  currentInstance: MeetInstance;
  instances: MeetInstance[];
  latestWeeks: SmallSheet[];
  sectors: MeetingSector[];
}
