import { FocusDetails } from './focusDetails';

export class Focus {
  constructor() {
    this.images = [];
    this.published = false;
    this.focusDetails = new FocusDetails();
  }
  uid: string;
  title: string;
  subTitle: string;
  excerpt: string;
  date: any;
  displayOrder: number;
  images: string[];
  published: boolean;
  focusDetails: FocusDetails;
}
