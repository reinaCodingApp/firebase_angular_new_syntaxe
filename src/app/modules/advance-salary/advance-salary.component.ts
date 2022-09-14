import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
  selector: 'app-advance-salary',
  templateUrl: './advance-salary.component.html'
})
export class AdvanceSalaryComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  @ViewChild('drawer') drawer: MatDrawer;
  constructor(
    public _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
     this._fuseMediaWatcherService.onMediaChange$
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe(({matchingAliases}) => {
         if ( matchingAliases.includes('md') )
         {
             this.drawerMode = 'side';
             this.drawerOpened = true;
             this.disableClose = true;
         }
         else
         {
             this.drawerMode = 'over';
             this.drawerOpened = false;
             this.disableClose = false;
         }
     });
  }

  toggleSidebar(name): void {
    // this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
