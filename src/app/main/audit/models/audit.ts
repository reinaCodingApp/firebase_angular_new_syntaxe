import { AuditMenu } from './audit-menu';
import { Employee } from '../../../common/models/employee';
import { Site } from '../../../common/models/site';

export class Audit{
    id: string;
    templateId: string;
    title: string;
    date: number;
    responsible: Employee;
    site: Site;
    report: string;
    isSealed: boolean;
    menus?: AuditMenu[];
}
