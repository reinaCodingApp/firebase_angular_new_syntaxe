import { Department } from './department';
import { Attachment } from 'app/common/models/attachment';
import { DiscussionItem } from './discussionItem';

export class Discussion {
  uniqueId: string;
  id: number;
  department: Department;
  date: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  isFraud: boolean;
  isClosed: boolean;
  attachment: Attachment;
  items: DiscussionItem[];
  read: boolean;
  unreadCommentsCount: number;
}
