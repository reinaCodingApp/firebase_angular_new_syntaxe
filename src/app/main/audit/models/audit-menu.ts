import { AuditSection } from './audit-section';

export class AuditMenu {
  id: string;
  title: string;
  sections?: Array<AuditSection>;
  displayOrder: number;
  report: string;
}
