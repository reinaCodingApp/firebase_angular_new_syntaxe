import { TonnageItemType } from './tonnageItemType';

export class TonnageDetail {
  constructor() {
    this.itemType = new TonnageItemType();
    this.lambsStrategy = false;
  }
  id?: number;
  weight?: number;
  percentage: number;
  tonnageId: number;
  itemType: TonnageItemType;
  quantity: number;
  isRealWeight: boolean;
  lambsStrategy?: boolean;
}
