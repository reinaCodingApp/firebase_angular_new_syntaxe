import { CompleteSite } from './completeSite';
import { SiteType } from './siteType';
import { FilterSiteType } from './filterSiteType';
import { Department } from '../../../common/models/department';

export class SitesMainViewModel {
  sites: CompleteSite[];
  siteTypes: SiteType[];
  filtreListTypes: FilterSiteType[];
  departments: Department[];
}
