import { MonthlyMeetingPresence } from './monthlyMeetingPresence';

export class MonthlyMeeting {
  id: number;
  title: string;
  description: string;
  date: Date | string;
  monthlyMeetingPresences: MonthlyMeetingPresence[];
}
