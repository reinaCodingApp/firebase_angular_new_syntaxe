import { MissionOrderCostType } from './missionOrderCostType';

export class MissionOrderCost {
  id: number;
  cost: number;
  isPersonalCost: boolean;
  otherName: string;
  costType: MissionOrderCostType;
}
