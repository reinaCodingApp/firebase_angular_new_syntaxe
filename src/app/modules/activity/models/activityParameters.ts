import { Employee } from '../../../common/models/employee';

export class ActivityParameters {
  constructor() {
    this.employees = [];
  }
  startDate: string;
  endDate: string;
  employees: Employee[];
  isTemporaryWorker: boolean;
  activitiesFilter: string;
}
