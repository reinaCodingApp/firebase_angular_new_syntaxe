export class Module {
  id: string;
  key: string;
  index: number;
  title: string;
  icon: string;
  url: string;
  /** fuse v15 brings the changes bellow : 
   *  'link' property has been created, and must replace the 'url' property.
   *  the value 'item' in 'type' does not exist anymore, it's been replaced by 'basic'
   *  according to these two changes, the necessary adaption has been implemneted when data is fetched.   */
  link?: string;
  type: 'item' | 'group' | 'collapsable' | 'basic';
  children?: Module [];
  grantedAccess?: number;
  exactMatch?: boolean;
  displayInMenu: boolean;
  aclDescription?: string;
}

