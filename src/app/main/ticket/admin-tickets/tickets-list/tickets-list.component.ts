import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AdminTicket } from '../../models/adminTicket';
import { TicketService } from '../../ticket.service';


@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TicketsListComponent implements OnInit, OnDestroy {
  tickets: AdminTicket[] = [];
  currentTicket: AdminTicket;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private ticketService: TicketService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.ticketService.onTicketsForAdminChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedTickets => {
        this.tickets = paginatedTickets.tickets;
      });

    this.ticketService.onCurrentTicketDetailsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currentTicket => {
        if (!currentTicket) {
          this.currentTicket = null;
        }
        else {
          this.currentTicket = currentTicket;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getTicketDetails(ticketId): void {
    this.ticketService.getTicketDetails(ticketId)
      .pipe(take(1))
      .subscribe((ticket) => {
        const url = this.activatedRoute.snapshot.url.join('/');
        this.location.go('/' + url + '/' + ticketId);
        this.ticketService.onCurrentTicketDetailsChanged.next(ticket);
        const foundIndex = this.tickets.findIndex(t => t.id === ticketId);
        if (!this.tickets[foundIndex].read) {
          this.tickets[foundIndex].read = true;
        }
        this.tickets[foundIndex].unreadCommentsCount = 0;
      });
  }
}
