import { AppService } from 'app/app.service';
import { PublicMessage } from './../models/public-message';
import { LoginService } from 'app/main/login/login.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { News } from '../models/news';
import { AngularFireAuth } from '@angular/fire/auth';
import { MainTools } from 'app/common/tools/main-tools';
import { Attachment } from 'app/common/models/attachment';
import { NewsDetailDialogComponent } from './dialogs/news-detail-dialog/news-detail-dialog.component';
import { AddNewsDialogComponent } from './dialogs/add-news-dialog/add-news-dialog.component';
import { TimelineService } from './timeline.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimelineComponent implements OnInit, OnDestroy {
  publicMessages: PublicMessage[] = [];
  news: News[] = [];
  commentMessages = [];
  messageParameter: PublicMessage = null;
  connectedUser: any = null;
  dialogRef: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private timelineService: TimelineService,
    private sharedNotificationService: SharedNotificationService,
    private appService: AppService,
    public matDialog: MatDialog,
    private loaderService: NgxUiLoaderService
  ) {
    this._unsubscribeAll = new Subject();
    this.messageParameter = { content: '', attachments: [], isClosed: false } as PublicMessage;
    this.appService.onCurentUserChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      if (data) {
        this.connectedUser = { uid: data.uid, email: data.email, displayName: data.displayName, avatar: data.photoURL };
      }
    });

  }
  openNewsDetailsPopup(news: News): void {
    this.timelineService.getNewsDetail(news.uid).then((detail) => {
      this.dialogRef = this.matDialog.open(NewsDetailDialogComponent, {
        data: {
          news: news,
          detail: detail
        }
      });
    });
  }
  openAddNewsPopup(): void {
    this.dialogRef = this.matDialog.open(AddNewsDialogComponent,
      {
        panelClass: 'edit-form-dialog',
        data: {
          action: 'new',
          author: this.connectedUser
        }
      });
  }
  addMessage(): void {
    if (!this.messageParameter || this.messageParameter.content.trim().length < 25) {
      this.sharedNotificationService.showError('Le commentaire doit contenir 25 caractères au minimum');
      return;
    }
    const message = {
      content: MainTools.replaceNewLines(this.messageParameter.content), isClosed: false,
      author: { ...this.connectedUser }, hasAttachments: false, attachments: this.messageParameter.attachments,
      date: new Date().getTime(), archived: false, pinned: false
    } as PublicMessage;
    message.hasAttachments = message.attachments && message.attachments.length > 0;
    this.timelineService.addPublicaMessage(message).then(() => {
      this.messageParameter = { content: '', attachments: [], isClosed: false } as PublicMessage;
      this.sharedNotificationService.showSuccess('Message posté avec succès');
    });
  }
  addComment(message: PublicMessage, index: number): void {
    if (!this.commentMessages[index] || this.commentMessages[index].trim().length < 5) {
      this.sharedNotificationService.showError('Le commentaire doit contenir 5 caractères au minimum');
      return;
    }
    const m = {
      content: MainTools.replaceNewLines(this.commentMessages[index]),
      parentId: message.uid,
      author: { ...this.connectedUser }, hasAttachments: false,
      date: new Date().getTime()
    } as PublicMessage;
    this.timelineService.addCommentPublicaMessage(m).then(() => {
      this.commentMessages[index] = '';
    });
  }
  attachmentPicked(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];

      this.timelineService.storeAttachment(file, 'message')
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(pourcentage => {
          if (pourcentage === 100) {
            console.log('upload complete');
          }
        });
    }
  }
  removeAttachment(attachment: Attachment): void {
    const index = this.messageParameter.attachments.indexOf(attachment);
    if (index >= 0) {
      this.messageParameter.attachments.splice(index, 1);
    }
  }

  closeDiscussion(currentMessage: PublicMessage): void {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Confirmation clôture',
        message: 'Etes-vous sûr de vouloir clôturer cette discussion ? '
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.loaderService.start();
          this.timelineService.closeDiscussion(currentMessage.uid)
            .then((result) => {
              this.loaderService.stop();
              this.sharedNotificationService.showSuccess('Discussion clôturé avec succès');
            }, (err) => {
              this.loaderService.stop();
              this.sharedNotificationService.showStandarError();
              console.log(err);
            });
        }
      });
  }
  archiveDiscussion(message: PublicMessage) {
    this.dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Confirmation archivage',
        message: 'Etes-vous sûr de vouloir archiver cette discussion ?'
      }
    });
    this.dialogRef.afterClosed()
    .subscribe(response => {
      this.timelineService.archiveDiscussion(message.uid).then(() => {
        this.sharedNotificationService.showSuccess('Discussion archivée');
      }, (err) => this.sharedNotificationService.showStandarError());
    });
  }
  pinDiscussion(message: PublicMessage) {
    const pin = message.pinned ? false : true;
    this.timelineService.pinDiscussion(message.uid, pin);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
    this.timelineService.onPublicMessagesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(messages => {
        this.publicMessages = messages;
      });
    this.timelineService.onNewsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(news => {
        this.news = news;
      });
    this.timelineService.onAttachmentUploaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (response && response.action && response.action === 'message') {
          this.messageParameter.attachments.push({ ...response.attachment });
          console.log('##', response);
        }
      });
    this.timelineService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
}
