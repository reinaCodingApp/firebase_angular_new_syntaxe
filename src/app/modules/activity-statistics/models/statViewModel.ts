import { MissionStatsViewModel } from './missionStatsViewModel';
import { OverTimeDetails } from './overTimeDetails';

export class StatViewModel {
  employeeName: string;
  dayRealyWorked: number;
  dayEffectiveWorked: number;
  hourRealyWorkedHundredth: string;
  hourRealyWorked: string;
  hourEffectiveWorked: string;
  hourEffectiveWorkedHundredth: string;
  mealTicket: number;
  additionalHours: string;
  additionalHoursHundredth: string;
  overtime25: string;
  overtime25Hundredth: string;
  overtime50: string;
  overtime50Hundredth: string;
  plusTime25: string;
  plusTime25Hundredth: string;
  plusTime50: string;
  plusTime50Hundredth: string;
  lunchBag: string;
  travelAdvantage: string;
  replacementAdvanage: string;
  advanceSalary: string;
  compensationCounter: string;
  employeeMissionAbroadViewModels: MissionStatsViewModel[];
  employeeOverTimeDetails: OverTimeDetails[];
}
