import { TonnageItemTypeFamily } from './tonnageItemTypeFamily';

export class TonnageItemType {
  constructor() {
    this.typeFamily = new TonnageItemTypeFamily();
  }
  id: number;
  name: string;
  weight: number;
  typeFamily: TonnageItemTypeFamily;
  isCarcass: boolean;
}
