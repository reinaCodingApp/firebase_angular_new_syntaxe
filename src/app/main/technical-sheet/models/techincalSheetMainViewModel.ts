import { Site } from '../../../common/models/site';
import { AdditiveProvider } from './additiveProvider';

export class TechnicalSheetMainViewModel {
  sites: Site[];
  startDate: string;
  endDate: string;
  providers: AdditiveProvider[];
}
