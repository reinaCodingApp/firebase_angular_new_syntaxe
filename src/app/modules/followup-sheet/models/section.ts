import { Folder } from './folder';

export class Section {
  id: number;
  title: string;
  ownerName: string;
  ownerId: number;
  folders: Folder[];
}
