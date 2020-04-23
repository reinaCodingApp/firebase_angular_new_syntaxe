import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { WebcmsService } from '../../webcms.service';
import { takeUntil } from 'rxjs/operators';
import { Discussion } from '../../models/discussion';
import { Department } from 'app/common/models/department';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';


@Component({
  selector: 'mail-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MailMainSidebarComponent implements OnInit, OnDestroy {
  isFraud: boolean;
  isClosed: boolean;
  counters: any;
  discussions: Discussion[];
  departments: Department[];
  departmentId: number;
  currentUrl: string;
  inSearchMode: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _mailService: WebcmsService,
    public _matDialog: MatDialog,
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
    this._mailService.onDepartmentsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(departments => {
        this.departments = departments;
      });
    this._mailService.onCountersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(counters => {
        this.counters = counters;
      });
    this._mailService.onDiscussionsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(paginatedDiscussions => {
        this.discussions = paginatedDiscussions.discussions;
      });
    this._mailService.onSearchModeChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => {
      this.inSearchMode = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
