import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminTicket } from 'app/modules/ticket/models/adminTicket';
import { Subject } from 'rxjs'

@Component({
  selector: 'ticket-list-item',
  templateUrl: './ticket-list-item.component.html'
})
export class TicketListItemComponent implements OnInit, OnDestroy {
  @Input() ticket: AdminTicket;

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

