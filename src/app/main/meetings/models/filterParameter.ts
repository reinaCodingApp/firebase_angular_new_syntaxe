import { MeetInstance } from './meetInstance';
import { SmallSheet } from '../../followup-sheet/models/smallSheet';
import { MeetingSector } from './meetingSector';

export class FilterParameter {
  constructor() {
    this.sheet = new SmallSheet();
    this.sector = new MeetingSector();
  }
  filter: string;
  sheet?: SmallSheet;
  sector?: MeetingSector;
  currentInstance: MeetInstance;
  includeClosedTasks?: boolean;
}
