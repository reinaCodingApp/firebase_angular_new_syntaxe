import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PostsService } from './posts.service';
import { Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { AddPostDialogComponent } from './add-post-dialog/add-post-dialog.component';
import { Post } from './models/post';
import { WebsiteService } from '../../website.service';

@Component({
  selector: 'posts',
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
    private _matDialog: MatDialog,
    private websiteService: WebsiteService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._postsService.onPostsChanged.subscribe(posts => {
      this.posts = posts;
    });
    this.websiteService.onHabilitationLoaded
    .subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
    this._postsService.onFilterChanged.subscribe(filter => {
      this._postsService.filterBy = filter;
      this._postsService.loadPosts(filter);
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
