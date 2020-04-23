import { Component, OnInit, Inject } from '@angular/core';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewsDetail } from 'app/main/home/models/news-detail';
import { MainTools } from 'app/common/tools/main-tools';
import { TimelineService } from '../../timeline.service';

@Component({
  selector: 'app-add-news-dialog',
  templateUrl: './add-news-dialog.component.html',
  styleUrls: ['./add-news-dialog.component.scss']
})
export class AddNewsDialogComponent implements OnInit {
  content = '';
  title: '';
  author: any;
  minLengthContent = 200;
  minLengthTitle = 15;
  newsUid: string;
  action: string;
  contentMaxSize = 1048487; // bytes
  constructor(private timelineService: TimelineService,
              private sharedNotificationService: SharedNotificationService,
              public matDialogRef: MatDialogRef<AddNewsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any)
  {
      if (this.data) {
        if (this.data.author) {
          this.author = this.data.author;
        }
        this.action = data.action;
      }
  }

  addNews() {
    if (this.title.trim().length < this.minLengthTitle) {
        this.sharedNotificationService.showError('Le titre de l\'article doit contenir ' + this.minLengthTitle + ' au minimum');
        return;
    }
    if (this.content.trim().length < this.minLengthContent) {
        this.sharedNotificationService.showError('Le contenu de l\'article doit contenir ' + this.minLengthTitle + ' au minimum');
        return;
    }
    this.timelineService.addNews(this.title, MainTools.replaceNewLines(this.content), this.author).then(() => {
      this.sharedNotificationService.showSuccess('Publication effectuée avec succès');
      this.matDialogRef.close();
    });
  }
  updateNewsDetail() {
    if (this.content.trim().length < this.minLengthContent) {
        this.sharedNotificationService.showError('Le contenu de l\'article doit contenir ' + this.minLengthTitle + ' au minimum');
        return;
    }
    const detail = {content: this.content, uid: this.newsUid} as NewsDetail;
    this.timelineService.updateNewsDetail(detail, this.title).then(() => {
        this.sharedNotificationService.showSuccess('Publication mise à jour avec succès');
        this.matDialogRef.close();
    });
}

  ngOnInit() {
  }

}
