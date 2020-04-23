export class News {
  uid: string;
  title: string;
  date: number;
  author: { uid: string,
    email: string,
    avatar?: string,
    displayName: string};
}
