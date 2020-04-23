import { Site } from '../../../common/models/site';

export class TechnicalSheetFilter {
  constructor() {
    this.site = new Site();
  }

  site: Site;
  startDate: string;
  endDate: string;
}
