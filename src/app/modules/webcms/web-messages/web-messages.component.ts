import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebMessagesService } from './web-messages.service';
import { Router } from '@angular/router';
import { PaginatedDiscussions } from './models/paginatedDiscussions';
import { Discussion } from './models/discussion';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
  selector: 'mail',
  templateUrl: './web-messages.component.html'
})
export class WebMessagesComponent implements OnInit, OnDestroy {
  hasSelectedMails: boolean;
  isIndeterminate: boolean;
  searchInput = '';
  currentMail: Discussion;
  currentUrl: string;
  maxLength = 20;
  paginatedDiscussions: PaginatedDiscussions;
  isScrolling: boolean;
  private _unsubscribeAll: Subject<any>;
  @ViewChild("drawer") drawer: MatDrawer;

  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  constructor(
    private _mailService: WebMessagesService,
    private router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._mailService.onCurrentUrlChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((url) => {
        this.currentUrl = url;
      });
    this._mailService.onDiscussionsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedDiscussions => {
        this.paginatedDiscussions = paginatedDiscussions;
      });
    this._mailService.onCurrentDiscussionChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currentMail => {
        if (!currentMail) {
          this.currentMail = null;
        }
        else {
          this.currentMail = currentMail;
        }
      });
    this._mailService.onTextSearchFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(searchFilter => {
        if (searchFilter) {
          this.searchInput = searchFilter;
        }
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

  searchDiscussions(param: any): any {
    const filter: string = param ? param.target.value : '';
    if (filter.trim().length > 0) {
      this.router.navigateByUrl('/webcms/search/' + filter);

    } else {
      this.searchInput = '';
      this.router.navigateByUrl('/webcms/discussions');
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  onScroll(): void {
    if (!(this.paginatedDiscussions.discussions.length >= this.paginatedDiscussions.total)) {
      this.isScrolling = true;
      this.paginatedDiscussions.start += this.maxLength;
      this._mailService.loadMessages(this.paginatedDiscussions.start)
        .then(() => {
          this.isScrolling = false;
        });
    }
  }

  toggleSidebar(name): void {
  }
}
