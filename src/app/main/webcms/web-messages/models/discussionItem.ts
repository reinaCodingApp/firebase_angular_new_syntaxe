import { Attachment } from 'app/common/models/attachment';

export class DiscussionItem {
  id: number;
  date: number;
  content: string;
  from: string;
  employeeId?: number;
  fromBackoffice: boolean;
  discussionId: number;
  attachments: Attachment[];
  read: boolean;
}
