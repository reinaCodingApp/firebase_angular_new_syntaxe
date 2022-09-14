import { Attachment } from 'app/common/models/attachment';

export class Comment {
  content: string;
  date: string;
  time: string;
  owner: string;
  ownerId: number;
  ticketId: number;
  hasAttachments: boolean;
  attachments: Attachment[];
}
