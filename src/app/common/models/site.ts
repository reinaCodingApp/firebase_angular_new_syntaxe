import { SiteType } from './site-type';

export class Site {
  id: number;
  name: string;
  types?: SiteType[];
}
