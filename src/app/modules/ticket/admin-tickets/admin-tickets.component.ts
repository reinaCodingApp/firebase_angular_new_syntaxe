import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { AdminTicket } from '../models/adminTicket';
import { PaginatedTickets } from '../models/paginatedTickets';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
  selector: 'admin-tickets',
  templateUrl: './admin-tickets.component.html',
  encapsulation: ViewEncapsulation.None

})
export class AdminTicketsComponent implements OnInit, OnDestroy {
  searchInput = '';
  currentUrl: string;
  maxLength = 10;
  currentTicket: AdminTicket;
  paginatedTickets: PaginatedTickets;
  isScrolling: boolean;
  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;

  @ViewChild("drawer") drawer: MatDrawer;
  constructor(
    private ticketService: TicketService,
    private router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService

  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(({ matchingAliases }) => {
      if (matchingAliases.includes("md")) {
        this.drawerMode = "side";
        this.drawerOpened = true;
        this.disableClose = true;
      } else {
        this.drawerMode = "over";
        this.drawerOpened = false;
        this.disableClose = false;
      }
    });

    this.ticketService.onCurrentUrlChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((url) => {
        this.searchInput = '';
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
    const filter: string = param ? param.target.value : '';
    if (filter.trim().length > 0) {
      this.router.navigateByUrl('/tickets/admin-tickets/search/' + filter);

    } else {
      this.searchInput = '';
      this.router.navigateByUrl('/tickets/admin-tickets/pending');
      
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onScroll(): void {
    if (!(this.paginatedTickets.tickets.length >= this.paginatedTickets.total)) {
      this.isScrolling = true;
      this.paginatedTickets.start += this.maxLength;
      this.ticketService.loadTickets(this.paginatedTickets.start)
        .then(() => {
          this.isScrolling = false;
        });
    }
  }

  toggleSidebar(name): void {
    
  }
}

