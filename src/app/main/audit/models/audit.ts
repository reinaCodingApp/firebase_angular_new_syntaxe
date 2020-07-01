import { AuditMenu } from './audit-menu';
import { Employee } from '../../../common/models/employee';
import { Site } from '../../../common/models/site';
import { Attachment } from 'app/common/models/attachment';

export class Audit {
  constructor() {
    this.attachments = [];
  }
  id: string;
  templateId: string;
  title: string;
  date: number;
  responsible: any;
  site: Site;
  report: string;
  isSealed: boolean;
  menus?: AuditMenu[];
  poleId: string;
  ownerId: string;
  attachments: Attachment[];
}
