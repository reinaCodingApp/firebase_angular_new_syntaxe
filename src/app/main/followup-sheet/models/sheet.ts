import { Section } from './section';
import { SmallSheet } from './smallSheet';

export class Sheet extends SmallSheet {
  sections: Section[];
  isClosed: boolean;
}
