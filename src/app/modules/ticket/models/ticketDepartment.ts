import { Service } from './service';
import { Employee } from '../../../common/models/employee';

export class TicketDepartment {
  id: number;
  includeAdvancedOptions: boolean;
  name: string;
  responsible: Employee;
  services: Service[];
}
