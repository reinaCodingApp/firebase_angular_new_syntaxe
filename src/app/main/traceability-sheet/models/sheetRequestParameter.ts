import { Site } from 'app/common/models/site';
import { Employee } from 'app/main/ticket/models/employee';
import { Attachment } from 'app/common/models/attachment';
import { TraceabilitySheet } from './traceabilitySheet';

export class SheetRequestParameter {
  site?: Site;
  year?: number;
  week?: number;
  sheet?: TraceabilitySheet;
  employee?: Employee;
  attachment?: Attachment;
}
