import { Site } from 'app/common/models/site';
import { TraceabilityMaterial } from '../traceabilityMaterial';

export interface TraceabilityMainViewModel {
  years: number[];
  selectedYear: number;
  selectedWeek: number;
  sites: Site[];
  shapes: TraceabilityMaterial[];
  colors: string[];
}
