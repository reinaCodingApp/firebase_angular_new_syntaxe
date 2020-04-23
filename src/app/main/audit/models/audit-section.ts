import { AuditItem } from './audit-item';

export class AuditSection{
    id: string;
    title: string;
    menuId: string;
    auditId: string;
    items: Array<AuditItem>;
    displayOrder: number;
}
