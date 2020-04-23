import { SiteType } from '../../main/sites/models/siteType';

export class Site {
  id: number;
  name: string;
  types?: SiteType[];
}
