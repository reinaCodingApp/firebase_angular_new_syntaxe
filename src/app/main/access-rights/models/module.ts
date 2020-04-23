export class Module {
  id: string;
  key: string;
  index: number;
  title: string;
  icon: string;
  url: string;
  type: 'item' | 'group' | 'collapsable';
  children?: Module [];
  grantedAccess?: number;
  exactMatch?: boolean;
  displayInMenu: boolean;
}

