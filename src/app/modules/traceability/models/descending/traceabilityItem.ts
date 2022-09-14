import { TraceabilityMaterial } from '../traceabilityMaterial';
import { ReferenceCode } from './referenceCode';

export class TraceabilityItem {
  constructor() {
    this.material = new TraceabilityMaterial();
    this.code = new ReferenceCode();
  }

  id: number;
  material: TraceabilityMaterial;
  code: ReferenceCode;
  isRing: boolean;
  traceabilityId: number;
  itemTitle: string;
}
