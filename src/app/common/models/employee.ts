import { Department } from './department';

export class Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  city?: string;
  birthdate?: string;
  isTemporaryWorker?: boolean;
  departments?: Department[];
  departmentsString?: string;
  isEnable?: boolean;
  isActive?: boolean;
}
