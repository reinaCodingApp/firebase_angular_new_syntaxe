import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Ticket } from 'app/main/ticket/models/ticket';
import { AdminTicket } from 'app/main/ticket/models/adminTicket';


@Component({
  selector: 'ticket-list-item',
  templateUrl: './ticket-list-item.component.html',
  styleUrls: ['./ticket-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

