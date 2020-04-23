import { Site } from '../../../common/models/site';
import { Employee } from '../../../common/models/employee';
import { TraceabilityMaterial } from './traceabilityMaterial';

export class CheckedCode {
  id: number;
  typedCode: string;
  traceabilityMaterial: TraceabilityMaterial;
  employee: Employee;
  site: Site;
  entryDate: string;
}
