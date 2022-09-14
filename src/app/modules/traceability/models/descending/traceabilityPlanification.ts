import { Traceability } from './traceability';
import { TraceabilityWeekCode } from './traceabilityWeekCode';

export class TraceabilityPlanification {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  color: string;
  items: Traceability[];
  mel: string;
  traceabilityWeekCodes: TraceabilityWeekCode[];
}
