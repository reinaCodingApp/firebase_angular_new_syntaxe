import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminTicket } from '../../models/adminTicket';
import { TicketService } from '../../ticket.service';
import { Service } from '../../models/service';
import { AddTicketDialogComponent } from '../../dialogs/add-ticket-dialog/add-ticket-dialog.component';


@Component({
  selector: 'admin-tickets-sidebar',
  templateUrl: './admin-tickets-sidebar.component.html'
})
export class AdminTicketsSidebarComponent implements OnInit, OnDestroy {
  tickets: AdminTicket[] = [];
  services: Service[];
  departmentId: number;
  currentUrl: string;
  inSearchMode: boolean;

  private _unsubscribeAll: Subject<any>;
  dialogRef: any;

  constructor(
    private ticketService: TicketService,
    public _matDialog: MatDialog,
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
    this.ticketService.onServicesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(services => {
        this.services = services;
      });
    this.ticketService.onTicketsForAdminChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedTickets => {
        this.tickets = paginatedTickets.tickets;
      });
    this.ticketService.onSearchModeChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.inSearchMode = response;
      });
  }

  addTicket(): void {
    this.dialogRef = this._matDialog.open(AddTicketDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

