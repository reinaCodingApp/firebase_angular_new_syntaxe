import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { PostsService } from '../posts.service';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { WebsiteService } from '../../../website.service';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { Post } from '../models/post';

@Component({
  selector: 'posts-list',
  templateUrl: './posts-list.component.html'
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[];
  displayedColumns = ['date', 'title'];
  dialogRef: any;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(private postsService: PostsService, public _matDialog: MatDialog, private websiteService: WebsiteService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.postsService.getCategories();
    this.postsService.loadPosts();
    this.postsService.onPostsChanged.subscribe(result => {
      this.posts = result;
    });
    this.websiteService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  disablePost(post): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Désactiver article',
        message: 'Etes-vous sûr de vouloir désactiver cet article ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.postsService.disablePost(post);
        }
      });
  }
}
