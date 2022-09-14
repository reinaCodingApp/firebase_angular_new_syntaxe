import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { AddForeignMissionDialogComponent } from './dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ForeignMissionService } from './foreign-mission.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-foreign-mission',
  templateUrl: './foreign-mission.component.html'
})
export class ForeignMissionComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  private _unsubscribeAll: Subject<any>;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _foreignMissionService: ForeignMissionService,
    public commonService: CommonService,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService) { 
      this._unsubscribeAll = new Subject();
    }

  ngOnInit(): void {
    this._foreignMissionService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
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

  addForeignMission(): void {
    this.dialogRef = this._matDialog.open(AddForeignMissionDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
  }

}
