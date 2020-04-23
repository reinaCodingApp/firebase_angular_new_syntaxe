import { CodirComment } from './codirComment';

export class MeetingSector {
  id: number;
  name: string;
  pictogram: string;
  codirComments: CodirComment[];
  taskItemsCount: number;
  lastWeeksTaskItemsCount: number;
}
