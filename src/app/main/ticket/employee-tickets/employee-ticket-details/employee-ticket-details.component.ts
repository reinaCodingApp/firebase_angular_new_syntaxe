import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TicketService } from '../../ticket.service';
import { takeUntil, take } from 'rxjs/operators';
import { PartialTicket } from '../../models/partialTicket';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AdminTicket } from '../../models/adminTicket';
import { Attachment } from 'app/common/models/attachment';
import { CommonService } from 'app/common/services/common.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { DetailedAdminTicket } from '../../models/detailedAdminTicket';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'employee-ticket-details',
  templateUrl: './employee-ticket-details.component.html',
  styleUrls: ['./employee-ticket-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmployeeTicketDetailsComponent implements OnInit, OnDestroy {
  ticket: DetailedAdminTicket;
  newComment = '';
  filesToUpload = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ticketService: TicketService,
    private commonService: CommonService,
    private _notificationService: SharedNotificationService,
    private _loaderService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ticketService.onCurrentTicketDetailsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(ticket => {
        this.ticket = ticket;
      });
  }

  addComment(): void {
    if (this.newComment.length > 0) {
      this._loaderService.start();
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
                  this._loaderService.stop();
                  this.newComment = '';
                  this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
                  this.filesToUpload = [];
                  this.ticket = currentTicket;
                });
            }
          } else {
            this._loaderService.stop();
            this._notificationService.showSuccess(`Votre commentaire est ajouté avec succès`);
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

  downloadAttachment(attachment: Attachment): void {
    this.ticketService.downloadAttachment(attachment)
      .pipe(take(1))
      .subscribe(data => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
