import { Sector } from './sector';
import { Section } from './section';

export class FollowupSheetRecapViewModel {
  sector: Sector;
  sections: Section[];
  weekNumber: string;
  year: string;
  instanceName: string;
  responsibleName: string;
}
