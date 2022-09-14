import { MissionOrderCostType } from './missionOrderCostType';
import { MissionOrder } from './missionOrder';
import { Employee } from '../../../common/models/employee';

export class MissionOrderViewModel {
  employees: Employee[];
  missionOrder: MissionOrder;
  missionOrders: MissionOrder[];
  missionOrdersTotal: number;
  missionOrderCostTypes: MissionOrderCostType[];
  missionStart: Date | string;
  missionEnd: Date | string;
  isEditAfterAdd: boolean;
  isInvoiced: boolean;
  haveAdminAccess: boolean;
}


