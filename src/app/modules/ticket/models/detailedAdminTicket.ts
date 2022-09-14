import { Attachment } from 'app/common/models/attachment';
import { AdminTicket } from './adminTicket';
import { Comment } from './comment';

export class DetailedAdminTicket extends AdminTicket {
  reaffectedBy: string;
  reaffectationDate: string;
  finishedBy: string;
  finishDate: string;
  resolvedBy: string;
  resolutionDate: string;
  comments: Comment[];
  attachments: Attachment[];
}
