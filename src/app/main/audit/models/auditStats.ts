export class AuditStats {
  constructor() {
    this.pointsStat = [];
    this.notCheckedPointsTotal = 0;
    this.reportsTotal = 0;
  }
  pointsStat: PointStat[];
  notCheckedPointsTotal: number;
  reportsTotal: number;
}

export class PointStat {
  effectiveValue: string;
  total?: number;
}
