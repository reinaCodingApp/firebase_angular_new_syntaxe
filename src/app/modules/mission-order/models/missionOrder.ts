import { Employee } from 'app/common/models/employee';
import { MissionOrderClient } from './missionOrderClient';
import { MissionOrderCost } from './missionOrderCost';
import { MissionOrderEmployee } from './missionOrderEmployee';

export class MissionOrder {
  constructor() {
    this.clients = [];
    this.costs = [];
    this.missionOrderEmployees = [];
    this.rebate = 0;
    this.owner = new Employee();
    this.isInvoiced = false;
    this.isDraft = false;
  }

  id: number;
  title: string;
  missionStart: Date | string;
  missionEnd: Date | string;
  report: string;
  rebate: number;
  isDraft: boolean;
  isInvoiced: boolean;
  owner: Employee;
  clients: MissionOrderClient[];
  costs: MissionOrderCost[];
  missionOrderEmployees: MissionOrderEmployee[];
  date: number;
}
