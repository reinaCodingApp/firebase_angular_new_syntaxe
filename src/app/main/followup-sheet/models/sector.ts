import { Employee } from 'app/common/models/employee';

export class Sector {
  id: number;
  name: string;
  poleId: number;
  pictogram: string;
  submitted: boolean;
  responsibleId: number | null;
  responsible: Employee;
}
