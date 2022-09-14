import { Site } from '../../../common/models/site';

export class Client {
  id: number;
  comments: string;
  webSite: string;
  contact: string;
  email: string;
  vatNumber: string;
  rcsNumber: string;
  fax: string;
  phone2: string;
  phone: string;
  country: string;
  zipCode: string;
  city: string;
  address: string;
  entrepriseName: string;
  name: string;
  isEnable: boolean;
  sites: Site[];
}
