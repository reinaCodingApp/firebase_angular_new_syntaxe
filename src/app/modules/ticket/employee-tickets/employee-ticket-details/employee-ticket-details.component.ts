import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TicketService } from '../../ticket.service';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Attachment } from 'app/common/models/attachment';
import { CommonService } from 'app/common/services/common.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { DetailedAdminTicket } from '../../models/detailedAdminTicket';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'employee-ticket-details',
  templateUrl: './employee-ticket-details.component.html'
})
export class EmployeeTicketDetailsComponent implements OnInit, OnDestroy {
  ticket: DetailedAdminTicket;
  newComment = '';
  filesToUpload = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ticketService: TicketService,
    private commonService: CommonService,
    private _notificationService: SharedNotificationService) { }

  ngOnInit(): void {
    this.ticketService.onCurrentTicketDetailsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(ticket => {
        this.ticket = ticket;
      });
  }

  addComment(): void {
    if (this.newComment.length > 0) {
      const hasAttachments = (this.filesToUpload != null && this.filesToUpload.length > 0);
      const data = {
        comment: {
          content: this.newComment,
          ticketId: this.ticket.id,
          hasAttachments: hasAttachments,
          employee: null,
          fromBackOffice: false
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
                  this.newComment = '';
                  this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
                  this.filesToUpload = [];
                  this.ticket = currentTicket;
                });
            }
          } else {
            this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
            this.ticket.comments = updatedTicket.comments;
            this.newComment = '';
          }

        }, err => {
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

  downloadAttachment(attachment: Attachment): void {
    this.ticketService.downloadAttachment(attachment)
      .pipe(take(1))
      .subscribe(data => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

}
