import { GeneratedTaskComment } from './generatedTaskComment';

export class GeneratedTask {
  id: number;
  employeeName: string;
  simpleTaskItemId: number;
  content: string;
  parentContent: string;
  endDate: string;
  isClosed: boolean;
  isLate: boolean;
  folderName: string;
  employeeDestinationId: number;
  comments: GeneratedTaskComment[];
}
