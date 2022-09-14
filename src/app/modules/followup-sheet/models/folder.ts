import { Attachment } from '../../../common/models/attachment';
import { Point } from './point';

export class Folder {
  id: number;
  title: string;
  ownerId: number;
  sectionId: number;
  points: Point[];
  attachments: Attachment[];
}
