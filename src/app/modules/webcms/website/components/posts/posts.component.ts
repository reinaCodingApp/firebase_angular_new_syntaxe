import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { PostsService } from './posts.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AddPostDialogComponent } from './add-post-dialog/add-post-dialog.component';
import { Post } from './models/post';
import { WebsiteService } from '../../website.service';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit, OnDestroy {
  dialogRef: any;
  posts: Post[] = [];
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);
  @ViewChild("drawer") drawer: MatDrawer;

  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  constructor(
    private _postsService: PostsService,
    private _matDialog: MatDialog,
    private websiteService: WebsiteService,
    private _fuseMediaWatcherService: FuseMediaWatcherService

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

    
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes("md")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
          this.disableClose = true; 
        } else { 
          this.drawerMode = "over";
          this.drawerOpened = false;
          this.disableClose = false;
        }
       
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
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
  }
}
