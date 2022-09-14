import { Site } from '../../../common/models/site';

export class Client {
  id: number;
  name: string;
  email: string;
  isEnable: boolean;
  sites: Site[];
}
