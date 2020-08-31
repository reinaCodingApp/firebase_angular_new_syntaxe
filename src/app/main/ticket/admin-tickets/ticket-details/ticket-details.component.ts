import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BASE_URL } from 'environments/environment';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Attachment } from 'app/common/models/attachment';
import { CommonService } from 'app/common/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { TicketService } from '../../ticket.service';
import { AssignTicketDialogComponent } from '../../dialogs/assign-ticket-dialog/assign-ticket-dialog.component';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { DetailedAdminTicket } from '../../models/detailedAdminTicket';
import { PaginatedTickets } from '../../models/paginatedTickets';


@Component({
  selector: 'ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TicketDetailsComponent implements OnInit, OnDestroy {
  ticket: DetailedAdminTicket;
  paginatedTickets: PaginatedTickets;
  inSearchMode: boolean;
  newComment: string;
  filesToUpload = [];
  baseUrl = BASE_URL;
  dialogRef: any;
  base64file: any;
  attachedFileName = '';
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  showDetails: false;

  constructor(
    private ticketService: TicketService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService,
    private _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.ticketService.onSearchModeChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.inSearchMode = response;
      });
    this.ticketService.onTicketsForAdminChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedTickets => {
        this.paginatedTickets = paginatedTickets;
      });
    this.ticketService.onCurrentTicketDetailsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currentTicket => {
        if (currentTicket) {
          this.ticket = currentTicket;
        }
      });
    this.ticketService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  closeTicket(): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Clôturer Ticket',
        message: 'Confirmez-vous cette opération de clôture ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this.ticketService.closeTicket(this.ticket)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
              this._loaderService.stop();
              this.ticket.isResolved = true;
              if (!this.inSearchMode) {
                const ticketIndex = this.paginatedTickets.tickets.findIndex(d => d.id === this.ticket.id);
                if (ticketIndex >= 0) {
                  this.paginatedTickets.tickets.splice(ticketIndex, 1);
                  this.ticketService.onTicketsForAdminChanged.next(JSON.parse(JSON.stringify(this.paginatedTickets)));
                }
              }
              this.ticket = null;
              this.ticketService.onCurrentTicketDetailsChanged.next(this.ticket);
              this._notificationService.showSuccess('Ticket clôturé avec succès');
            }, (err) => {
              console.log(err);
              this._notificationService.showStandarError();
              this._loaderService.stop();
            });
        }
      });
  }

  reOpenTicket(): void {
    this._loaderService.start();
    this.ticketService.reOpenTicket(this.ticket)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this._loaderService.stop();
        this.ticket.isResolved = false;
        const ticketIndex = this.paginatedTickets.tickets.findIndex(d => d.id === this.ticket.id);
        if (ticketIndex >= 0) {
          this.paginatedTickets.tickets.splice(ticketIndex, 1);
          this.ticketService.onTicketsForAdminChanged.next(JSON.parse(JSON.stringify(this.paginatedTickets)));
        }
        this.ticket = null;
        this.ticketService.onCurrentTicketDetailsChanged.next(this.ticket);
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
      });
  }

  downloadAttachment(attachment: Attachment): void {
    this.ticketService.downloadAttachment(attachment)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  addComment(): void {
    if (this.newComment.length > 3) {
      this._loaderService.start();
      const hasAttachments = (this.filesToUpload != null && this.filesToUpload.length > 0);
      const data = {
        comment: {
          content: this.newComment,
          ticketId: this.ticket.id,
          hasAttachments: hasAttachments,
          employee: null,
          fromBackOffice: true
        }
      };
      this.ticketService.addComment(data)
        .pipe(take(1))
        .subscribe((updatedTicket) => {
          if (hasAttachments) {
            if (updatedTicket.commentsCount > 0) {
              const commentId = updatedTicket.comments[updatedTicket.commentsCount - 1].id;
              this.ticketService.uploadFiles(null, commentId, this.filesToUpload)
                .pipe(take(1))
                .subscribe((currentTicket) => {
                  this._loaderService.stop();
                  this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
                  this.newComment = '';
                  this.filesToUpload = [];
                  this.ticket = currentTicket;
                  // this._ticketService.refreshDataForUser();
                });
            }
          } else {
            this._loaderService.stop();
            this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
            // this._ticketService.refreshDataForUser();
            this.ticket.comments = updatedTicket.comments;
            this.newComment = '';
          }

        }, err => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  preview(files): void {
    if (files.length === 0) {
      return;
    }
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      this.filesToUpload.push(file);
    }
  }

  removeFile(file): void {
    const index = this.filesToUpload.indexOf(file);
    this.filesToUpload.splice(index, 1);
  }

  updateTicketUrgent(): void {
    if (!this.ticket.isResolved) {
      this.ticketService.updateTicketUrgent(this.ticket.id)
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            this.ticket.urgent = !this.ticket.urgent;
            if (!this.inSearchMode) {
              const ticketIndex = this.paginatedTickets.tickets.findIndex(d => d.id === this.ticket.id);
              if (ticketIndex >= 0) {
                this.paginatedTickets.tickets.splice(ticketIndex, 1);
                this.ticketService.onTicketsForAdminChanged.next(JSON.parse(JSON.stringify(this.paginatedTickets)));
              }
            }
            this.ticket = null;
            this.ticketService.onCurrentTicketDetailsChanged.next(this.ticket);
          }
        }, err => {
          console.log(err);
        });
    }
  }

}

