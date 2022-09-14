import { Employee } from '../../../common/models/employee';
import { Department } from '../../../common/models/department';
import { Provider } from './provider';

export class CompleteEmployee extends Employee {
  constructor() {
    super();
    this.departments = [];
    this.provider = new Provider();
  }
  city: string;
  birthdate: string;
  isTemporaryWorker: boolean;
  provider: Provider;
  departments: Department[];
  departmentsString: string;
  isEnable: boolean;
  excludeFromPlusAndOverComputeTime: boolean;
}
