import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddNewsDialogComponent } from '../add-news-dialog/add-news-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-news-detail-dialog',
  templateUrl: './news-detail-dialog.component.html',
  styleUrls: ['./news-detail-dialog.component.scss']
})
export class NewsDetailDialogComponent implements OnInit, OnDestroy {
  content = '';
  title: '';
  unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(public matDialogRef: MatDialogRef<AddNewsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    if (this.data) {
      const news = this.data.news;
      this.title = news.title;
      this.content = data.detail.content;
    }

  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.content = '';
    this.title = '';
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
