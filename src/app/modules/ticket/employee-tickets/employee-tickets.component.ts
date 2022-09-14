import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PartialTicket } from '../models/partialTicket';
import { TicketService } from '../ticket.service';
import { AddTicketDialogComponent } from '../dialogs/add-ticket-dialog/add-ticket-dialog.component';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';

@Component({
  selector: 'app-employee-tickets',
  templateUrl: './employee-tickets.component.html'
})
export class EmployeeTicketsComponent implements OnInit, OnDestroy {

  tickets: PartialTicket[] = [];
  displayColumns = ['title', 'date', 'isResolved', 'unreadCommentsCount'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ticketService: TicketService,
    private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.ticketService.onTicketsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(tickets => {
        this.tickets = [...tickets];
      });
    this.ticketService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  addTicket(): void {
    this.dialogRef = this.matDialog.open(AddTicketDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

}



