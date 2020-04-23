import { Employee } from '../../../common/models/employee';
import { Site } from '../../../common/models/site';
import { TraceabilityColor } from './traceabilityColor';

export class TraceabilitySheetViewModel {
  years: number[];
  weeks: number[];
  colors: TraceabilityColor[];
  sites: Site[];
  employees: Employee[];
}
