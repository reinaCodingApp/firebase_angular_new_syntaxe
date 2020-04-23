import { TourSheetActivityDay } from './tourSheetActivityDay';

export class WeekStats {
  totalWeek: number;
  totalWeekStr: string;
  totalWeekOnSite: number;
  totalWeekOnSiteStr: string;
  totalBreaks: number;
  totalBreaksStr: string;

  monday: TourSheetActivityDay;
  tuesday: TourSheetActivityDay;
  wednesday: TourSheetActivityDay;
  thursday: TourSheetActivityDay;
  friday: TourSheetActivityDay;
  saturday: TourSheetActivityDay;
  sunday: TourSheetActivityDay;
}
