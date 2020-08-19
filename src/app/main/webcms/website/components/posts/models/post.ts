import { Category } from './category';

export class Post {
  constructor() {
    this.src = new PostImage();
  }
  uid: string;
  id: string;
  title: any;
  content: any;
  timestamp: number;
  excerpt: any;
  src: PostImage;
  categoryId: string;
  fileName: string;
  editionDate: any;
}

class PostImage {
  big: string = '';
  medium: string = '';
}
