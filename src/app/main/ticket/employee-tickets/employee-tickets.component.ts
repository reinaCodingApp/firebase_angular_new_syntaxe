import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { PartialTicket } from '../models/partialTicket';
import { TicketService } from '../ticket.service';
import { AddTicketDialogComponent } from '../dialogs/add-ticket-dialog/add-ticket-dialog.component';

@Component({
  selector: 'app-employee-tickets',
  templateUrl: './employee-tickets.component.html',
  styleUrls: ['./employee-tickets.component.scss'],
  animations: fuseAnimations
})
export class EmployeeTicketsComponent implements OnInit, OnDestroy {

  tickets: PartialTicket[] = [];
  displayColumns = ['title', 'date', 'isResolved', 'unreadCommentsCount'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ticketService: TicketService,
    private matDialog: MatDialog,
    private loaderService: NgxUiLoaderService,
    private notificationService: SharedNotificationService) {
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
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}



