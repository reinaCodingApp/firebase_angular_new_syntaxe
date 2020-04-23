import { Attachment } from '../../../common/models/attachment';
import { Employee } from '../../../common/models/employee';
import { Site } from '../../../common/models/site';
import { SheetItem } from './sheetItem';

export class TraceabilitySheet {
  id: number;
  date: string;
  weekNumber: string;
  site: Site;
  responsible: Employee;
  days: boolean[];
  quantityOfSacrifices: number;
  melCode: string;
  tamponCode: string;
  sticks: SheetItem[];
  colsons: SheetItem[];
  scotchs: SheetItem[];
  feuillards: SheetItem[];
  pics: SheetItem[];
  team: Employee[];
  hasAttachments: boolean;
  attachments: any[];
}
