import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WebcmsService } from './webcms.service';
import { Discussion } from 'app/main/webcms/models/discussion';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { PaginatedDiscussions } from './models/paginatedDiscussions';

@Component({
  selector: 'mail',
  templateUrl: './webcms.component.html',
  styleUrls: ['./webcms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WebcmsComponent implements OnInit, OnDestroy {
  hasSelectedMails: boolean;
  isIndeterminate: boolean;
  searchInput = '';
  currentMail: Discussion;
  currentUrl: string;
  maxLength = 20;
  paginatedDiscussions: PaginatedDiscussions;
  isScrolling: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _mailService: WebcmsService,
    private _fuseSidebarService: FuseSidebarService,
    private loaderService: NgxUiLoaderService,
    private router: Router
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

  }

  searchDiscussions(param: any): any {
    this.loaderService.start();
    const filter: string = param ? param.target.value : '';
    if (filter.trim().length > 0) {
      this.loaderService.stop();
      this.router.navigateByUrl('/webcms/search/' + filter);

    } else {
      this.searchInput = '';
      this.loaderService.stop();
      this.router.navigateByUrl('/webcms/discussions');
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
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
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
