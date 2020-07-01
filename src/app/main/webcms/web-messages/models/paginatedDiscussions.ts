import { Discussion } from './discussion';

export class PaginatedDiscussions {

  constructor() {
    this.discussions = [];
  }

  discussions: Discussion[];
  start?: number;
  total?: number;
}
