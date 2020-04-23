import { Site } from '../../../common/models/site';
import { Ingredient } from './ingredient';
import { AdditiveProvider } from './additiveProvider';
import { Attachment } from '../../../common/models/attachment';

export class TechnicalSheet {
  constructor() {
    this.site = new Site();
    this.provider = new AdditiveProvider();
  }
  id: number;
  site: Site;
  productName: string;
  sheetCode: string;
  productCharacteristics: string;
  validationDate: string;
  provider: AdditiveProvider;
  ingredients: Ingredient[];
  attachment: Attachment;
  isEditable: boolean;
  comment: string;
}
