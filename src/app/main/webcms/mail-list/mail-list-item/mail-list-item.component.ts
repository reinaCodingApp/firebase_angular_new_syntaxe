import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Discussion } from 'app/main/webcms/models/discussion';


@Component({
  selector: 'mail-list-item',
  templateUrl: './mail-list-item.component.html',
  styleUrls: ['./mail-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
