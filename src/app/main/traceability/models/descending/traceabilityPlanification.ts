import { Traceability } from './traceability';

export class TraceabilityPlanification {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  color: string;
  items: Traceability[];
  mel: string;
}
