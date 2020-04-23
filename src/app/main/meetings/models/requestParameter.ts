import { EmployeeLevel } from '../../followup-sheet/models/employeeLevel';
import { GeneratedTask } from './generatedTask';
import { MeetInstance } from './meetInstance';
import { SimpleTaskItem } from './simpleTaskItem';
import { GeneratedTaskComment } from './generatedTaskComment';

export class RequestParameter {
  compactEmployeeLevels?: EmployeeLevel[];
  task?: GeneratedTask;
  point?: SimpleTaskItem;
  instance?: MeetInstance;
  comment?: GeneratedTaskComment;
  employee?: EmployeeLevel;
  date?: string;
}
