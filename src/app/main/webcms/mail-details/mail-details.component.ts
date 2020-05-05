import { MainTools } from 'app/common/tools/main-tools';
import { AppService } from 'app/app.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { WebcmsService } from '../webcms.service';
import { Discussion } from 'app/main/webcms/models/discussion';
import { DiscussionItem } from 'app/main/webcms/models/discussionItem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BASE_URL } from 'environments/environment';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { LoginService } from 'app/main/login/login.service';
import { Attachment } from 'app/common/models/attachment';
import { CommonService } from 'app/common/services/common.service';
import { MatDialog } from '@angular/material';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { PaginatedDiscussions } from '../models/paginatedDiscussions';


@Component({
  selector: 'mail-details',
  templateUrl: './mail-details.component.html',
  styleUrls: ['./mail-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MailDetailsComponent implements OnInit, OnDestroy {
  discussion: Discussion;
  paginatedDiscussions: PaginatedDiscussions;
  inSearchMode: boolean;
  replyContent: string;
  baseUrl = BASE_URL;
  dialogRef: any;
  base64file: any;
  attachedFileName = '';
  private unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);
  showDetails: false;
  connectedEmployeeId: number;

  constructor(
    private _mailService: WebcmsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private appService: AppService,
    private _matDialog: MatDialog
  ) {
    this.unsubscribeAll = new Subject();
    this.appService.onCurentUserChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(response => {
        this.connectedEmployeeId = response.customClaims.employeeId;
      });
  }

  ngOnInit(): void {
    this._mailService.onSearchModeChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(response => {
        this.inSearchMode = response;
      });
    this._mailService.onDiscussionsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(paginatedDiscussions => {
        this.paginatedDiscussions = paginatedDiscussions;
        console.log(this.paginatedDiscussions);
      });
    this._mailService.onCurrentDiscussionChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(currentdiscussion => {
        if (currentdiscussion) {
          this.discussion = currentdiscussion;
        }
      });
    this._mailService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });


  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addDiscussionItem(): void {
    if (this.replyContent == null || this.replyContent.trim().length <= 3) {
      this._notificationService.showWarning('Vous devez insérer un message suffisamment long');
    } else {
      this._loaderService.start();
      const discussionItem = new DiscussionItem();
      discussionItem.discussionId = this.discussion.id;
      discussionItem.content = this.replyContent;
      discussionItem.employeeId = this.connectedEmployeeId;
      discussionItem.attachments = null;
      if (this.base64file != null && this.base64file.length > 0) {
        const attachment = new Attachment();
        attachment.content = this.base64file;
        attachment.fileName = this.attachedFileName;
        discussionItem.attachments = [];
        discussionItem.attachments.push(attachment);
      }
      this._mailService.addDiscussionItem(discussionItem)
        .pipe(take(1))
        .subscribe(createdDiscussionItem => {
          this._loaderService.stop();
          this.discussion.items.push(createdDiscussionItem);
          this._notificationService.showSuccess('Votre message a été envoyé avec succès');
          this.replyContent = '';
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  closeDiscussion(): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Cloturer discussion',
        message: 'Etes-vous sûr de vouloir cloturer cette discussion ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._mailService.closeDiscussion(this.discussion.uniqueId, this.discussion.id).then(() => {
            this.discussion.isClosed = true;
            if (!this.inSearchMode) {
              const discussionIndex = this.paginatedDiscussions.discussions.findIndex(d => d.id === this.discussion.id);
              if (discussionIndex >= 0) {
                this.paginatedDiscussions.discussions.splice(discussionIndex, 1);
                this._mailService.onDiscussionsChanged.next(JSON.parse(JSON.stringify(this.paginatedDiscussions)));
              }
            }
            this.discussion = null;
            this._mailService.onCurrentDiscussionChanged.next(this.discussion);
            this._mailService.getCounters();
            this._loaderService.stop();
          });
        }
      });
  }

  downloadAttachment(attachment: Attachment): void {
    this._mailService.downloadAttachment(attachment)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  getAttachment(files): void {
    if (files != null && files.length > 0) {
      const attachment = files[0];
      this.attachedFileName = files[0].name;
      const reader = new FileReader();
      reader.onload = this.onFileReaderLoad.bind(this);
      reader.readAsBinaryString(attachment);
    }
  }

  onFileReaderLoad(readerEvt): void {
    const binaryString = readerEvt.result;
    this.base64file = binaryString;
    this.base64file = btoa(binaryString);
  }

  removeAttachment(): void {
    this.base64file = null;
    this.attachedFileName = '';
  }

}
