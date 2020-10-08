import { Employee } from './../../ticket/models/employee';
import { CodirComment } from './codirComment';

export class MeetingSector {
  id: number;
  name: string;
  codirComments: CodirComment[];
  taskItemsCount: number;
  lastWeeksTaskItemsCount: number;
  responsible: Employee;
}
