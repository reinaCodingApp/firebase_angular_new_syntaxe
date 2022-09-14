import { Section } from './section';
import { Attachment } from '../../../common/models/attachment';
import { Folder } from './folder';

export class RequestParameter {
  section?: Section;
  folder?: Folder;
  attachment?: Attachment;
  employeeLevelId?: number;
  sheetId?: number;
}
