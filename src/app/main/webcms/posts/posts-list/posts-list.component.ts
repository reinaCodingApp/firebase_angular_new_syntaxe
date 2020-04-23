import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { PostsService } from '../posts.service';
import { Post } from 'app/main/webcms/posts/models/post';
import { AddPostDialogComponent } from '../dialogs/add-post-dialog/add-post-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[];
  displayedColumns = ['date', 'title', 'actions'];
  dialogRef: any;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(private postsService: PostsService, public _matDialog: MatDialog) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.postsService.onPostsChanged.subscribe(result => {
      this.posts = result;
    });
    this.postsService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  updatePost(post): void {
    if (this.habilitation.canEdit()) {
      this.dialogRef = this._matDialog.open(AddPostDialogComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          mode: 'edit',
          post: post
        }
      });
    }
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
