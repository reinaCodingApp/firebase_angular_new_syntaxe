import { Site } from '../../../common/models/site';

export class MissionOrderClient {
  constructor() {
    this.sites = [];
  }

  id: number;
  name: string;
  sites: Site[];
}
