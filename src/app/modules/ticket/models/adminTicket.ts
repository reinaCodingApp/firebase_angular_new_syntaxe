import { Ticket } from './ticket';

export class AdminTicket extends Ticket {
  ownerFirstName: string;
  ownerLastName: string;
  serviceName: string;
  toEmployeeFirstName: string;
  toEmployeeLastName: string;
  toEmployeeId: number;
  deadline: string;
  deadlineTime: string;
  isFinished: boolean;
  isLate: boolean;
  commentsCount: number;
}
