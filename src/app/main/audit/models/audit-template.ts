import { AuditMenu } from './audit-menu';
import { SiteType } from '../../sites/models/siteType';
export class AuditTemplate {
    id: string;
    name: string;
    siteTypes: SiteType[];
    menus?: AuditMenu[];
    status?: 'valid' | 'invalid';
}
