export class FocusDetails {
  constructor() {
    this.initFocus();
  }

  uid: string;
  descriptionsBlock: DescriptionBlock[];
  location: FocusLocation;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  webSite: string;
  twitter: string;
  facebook: string;
  instagram: string;
  interlocutor: Interlocutor;
  illustrations: Illustration[];
  videos: string;

  initFocus(): void {
    this.address = null;
    this.city = null;
    this.zipCode = null;
    this.country = null;
    this.phone = null;
    this.email = null;
    this.webSite = null;
    this.twitter = null;
    this.facebook = null;
    this.instagram = null;
    this.descriptionsBlock = [{ title: '', content: '' },
    { title: '', content: '' },
    { title: '', content: '' }];
    this.illustrations = [{ title: '', image: '', comment: '' },
    { title: '', image: '', comment: '' },
    { title: '', image: '', comment: '' },
    { title: '', image: '', comment: '' }];
    this.location = new FocusLocation();
    this.interlocutor = new Interlocutor();
    this.videos = '';
  }
}

export class DescriptionBlock {
  title: string;
  content: string;
}

export class Illustration {
  title: string;
  image: string;
  comment: string;
}

export class Interlocutor {
  lastName: string;
  firstName: string;
  profession: string;
  presentation: string;
  companyName: string;
  image: string;
}

export class FocusLocation {
  latitude: number;
  longitude: number;
}

