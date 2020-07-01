import { AuditMenu } from './audit-menu';
export class AuditTemplate {
    id: string;
    name: string;
    poleId: string;
    menus?: AuditMenu[];
    status?: 'valid' | 'invalid';
}
