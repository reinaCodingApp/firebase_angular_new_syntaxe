import { Site } from 'app/common/models/site';
import { TraceabilityItem } from './traceabilityItem';

export class Traceability {
  constructor() {
    this.site = new Site();
  }
  id: number;
  site: Site;
  color: string;
  description: string;
  planificationId: number;
  traceabilityItems: TraceabilityItem[];
  mel: string;
}
