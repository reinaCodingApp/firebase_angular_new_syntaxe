import { Employee } from './employee';
import { TicketDepartment } from './ticketDepartment';
import { Stat } from './stat';
import { Service } from './service';
import { AdminTicket } from './adminTicket';
import { PartialTicket } from './partialTicket';

export class TicketViewModel {
  isBackofficeMember: boolean;
  vm: {
    connectedEmployee: Employee;
    currentDepartment: TicketDepartment;
    currentDepartmentStats: Stat[];
    date: string;
    isAdmin: boolean;
    isBackofficeMember: boolean;
    isServiceManager: boolean;
    isSharingMode: boolean;
    members: Employee[];
    myLatestTickets: PartialTicket[];
    services: Service[];
    sharedTicket: any;
    sharingEmployees: any;
    ticketsForAdmin: AdminTicket[];
    weekNumber: number;
  };
}
