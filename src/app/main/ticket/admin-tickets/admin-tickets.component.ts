import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { AdminTicket } from '../models/adminTicket';
import { PaginatedTickets } from '../models/paginatedTickets';

@Component({
  selector: 'admin-tickets',
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminTicketsComponent implements OnInit, OnDestroy {
  searchInput = '';
  currentUrl: string;
  maxLength = 10;
  currentTicket: AdminTicket;
  paginatedTickets: PaginatedTickets;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private ticketService: TicketService,
    private _fuseSidebarService: FuseSidebarService,
    private loaderService: NgxUiLoaderService,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.ticketService.onCurrentUrlChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((url) => {
        this.currentUrl = url;
      });
    this.ticketService.onTicketsForAdminChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedTickets => {
        this.paginatedTickets = paginatedTickets;
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
    this.ticketService.onTextSearchFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(searchFilter => {
        if (searchFilter) {
          this.searchInput = searchFilter;
        }
      });
  }

  searchDiscussions(param: any): any {
    this.loaderService.start();
    const filter: string = param ? param.target.value : '';
    if (filter.trim().length > 0) {
      this.loaderService.stop();
      this.router.navigateByUrl('/admin-tickets/search/' + filter);

    } else {
      this.searchInput = '';
      this.loaderService.stop();
      this.router.navigateByUrl('/admin-tickets/pending');
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onScroll(): void {
    if (this.paginatedTickets.tickets.length < this.paginatedTickets.total) {
      this.paginatedTickets.start += this.maxLength;
      this.ticketService.loadTickets(this.paginatedTickets.start);
    }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}

