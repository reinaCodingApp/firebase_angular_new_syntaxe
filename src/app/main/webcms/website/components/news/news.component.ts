import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { WebsiteService } from '../../website.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { NewsService } from './news.service';
import { map } from 'rxjs/operators';
import { Post } from '../posts/models/post';

@Component({
  selector: 'news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewsComponent implements OnInit {
  news: Post[];
  displayedColumns = ['date', 'title'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private websiteService: WebsiteService,
    private newsService: NewsService) {
  }

  ngOnInit(): void {
    this.newsService.getNews().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Post;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(news => {
      this.news = news;
    });
    this.websiteService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
}
