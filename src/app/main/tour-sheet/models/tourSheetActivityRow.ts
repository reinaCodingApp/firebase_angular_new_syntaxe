import { TourSheetActivityDay } from './tourSheetActivityDay';

export class TourSheetActivityRow {
  id: number;
  siteName: string;
  monday: TourSheetActivityDay;
  tuesday: TourSheetActivityDay;
  wednesday: TourSheetActivityDay;
  thursday: TourSheetActivityDay;
  friday: TourSheetActivityDay;
  saturday: TourSheetActivityDay;
  sunday: TourSheetActivityDay;
}
