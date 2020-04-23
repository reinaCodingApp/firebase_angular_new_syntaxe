import { EmployeeLevel } from '../../followup-sheet/models/employeeLevel';
import { SimpleTaskItem } from './simpleTaskItem';

export class CodirComment {
  id?: number;
  simpleTaskItem?: SimpleTaskItem;// à quoi il servvira ?
  simpleTaskItemId?: number;
  date?: Date | string;
  owner?: EmployeeLevel;
  ownerId?: number;
  employeeDestination?: EmployeeLevel;
  employeeDestinationId?: number | null;
  content: string;
  note?: number;
  endDate?: Date | string | null;
  isSimpleComment?: boolean;
  comments?: CodirComment[];
  isLastWeeksComment?: boolean;
  folderName?: string;
}
