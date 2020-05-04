import { Site } from '../../../common/models/site';
import { Client } from './client';
import { TonnageDetail } from './tonnageDetail';
import { Employee } from 'app/main/ticket/models/employee';

export class Tonnage {
  constructor() {
    this.site = new Site();
    this.client = new Client();
  }
  id: number;
  date: Date | string;
  client: Client;
  details: TonnageDetail[];
  site: Site;
  observations: string;
  validationDate?: Date | string | null;
  isValidated?: boolean;
  validatedByEmployee?: Employee;
  validatedByEmployeeId?: number;
}
