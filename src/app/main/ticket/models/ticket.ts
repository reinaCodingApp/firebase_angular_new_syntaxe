import { PartialTicket } from './partialTicket';

export class Ticket extends PartialTicket {
  details: string;
  requestedById: number;
  departmentId: number;
  toServiceId: number;
  emergencyLevel: number;
  attachmentId: number;
  isPrivate: boolean;
  hasAttachments: boolean;
  urgent: boolean;
}
