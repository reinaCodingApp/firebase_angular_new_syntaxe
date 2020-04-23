import { AdminTicket } from './adminTicket';

export class PaginatedTickets {
  constructor() {
    this.tickets = [];
  }
  tickets: AdminTicket[];
  start?: number;
  total?: number;
}
