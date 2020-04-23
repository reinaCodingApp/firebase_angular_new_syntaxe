import { PossibleValue } from './possible-value';

export class AuditItem
{
    id: string;
    title: string;
    sectionId: string;
    auditId: string;
    menuId: string;
    possibleValues: PossibleValue;
    effectiveValue?: string;
    displayOrder: number;
}
