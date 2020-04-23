import { MissionOrder } from './missionOrder';

export class PaginatedMissionOrders {
  constructor() {
    this.missionOrders = [];
  }
  missionOrders: MissionOrder[];
  start?: number;
  total?: number;
}
