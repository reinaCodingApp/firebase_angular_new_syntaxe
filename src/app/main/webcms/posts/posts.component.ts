import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Post } from 'app/main/webcms/posts/models/post';
import { PostsService } from './posts.service';
import { Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostDialogComponent } from './dialogs/add-post-dialog/add-post-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'contacts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PostsComponent implements OnInit, OnDestroy {
  dialogRef: any;
  posts: Post[] = [];
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _postsService: PostsService,
    private _fuseSidebarService: FuseSidebarService,
    private _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._postsService.onPostsChanged.subscribe(posts => {
      this.posts = posts;
    });
    this._postsService.onHabilitationLoaded
    .subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  addPost(): void {
    this.dialogRef = this._matDialog.open(AddPostDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        mode: 'new'
      }
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
