import { Attachment } from 'app/common/models/attachment';

export class PublicMessage{
  uid: string;
  date: number;
  content: string;
  parentId: string;
  hasAttachments: boolean;
  attachments: Attachment[];
  author: { uid: string,
            email: string,
            avatar?: string,
            displayName: string};
  comments?: PublicMessage[];
  isClosed: boolean;
  pinned?: boolean;
  archived?: boolean;
}
