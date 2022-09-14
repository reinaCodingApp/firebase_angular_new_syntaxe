import { Site } from '../../../common/models/site';
import { Tonnage } from './tonnage';
import { TonnageItemTypeFamily } from './tonnageItemTypeFamily';
import { TonnageItemType } from './tonnageItemType';
import { TonnageFilterViewModel } from './tonnageFilterViewModel';
import { TotalTonnageByType } from './totalTonnageByType';

export class TonnageMainViewModel {
  sites: Site[];
  tonnages: Tonnage[];
  tonnage: Tonnage;
  tonnageFilterViewModel: TonnageFilterViewModel;
  tonnageFamilies: TonnageItemTypeFamily[];
  totalBySelectedPeriod: TotalTonnageByType[];
  totalBySelectedPartner: TotalTonnageByType[];
  possiblePercentage: number[];
  tonnageAbats: TonnageItemType[];
  tonnageItemTypes: TonnageItemType[];
}
