import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Discussion } from '../../models/discussion';


@Component({
  selector: 'mail-list-item',
  templateUrl: './mail-list-item.component.html'
})
export class MailListItemComponent implements OnInit, OnDestroy {
  @Input() mail: Discussion;

  @HostBinding('class.selected')
  selected: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor() {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
