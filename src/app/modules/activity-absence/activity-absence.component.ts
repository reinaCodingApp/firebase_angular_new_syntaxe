import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityAbsenceDialogComponent } from './dialogs/add-activity-absence-dialog/add-activity-absence-dialog.component';
import { ActivityAbsenceService } from './activity-absence.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activity-absence',
  templateUrl: './activity-absence.component.html'
})
export class ActivityAbsenceComponent implements OnInit {
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  @ViewChild("drawer") drawer: MatDrawer;

  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;

  constructor(
    private _activityAbsenceService: ActivityAbsenceService,
    public commonService: CommonService,    
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
      this._unsubscribeAll = new Subject();
    }

  ngOnInit(): void {
    this._activityAbsenceService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
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

  addActivityAbsence(): void {
    this.dialogRef = this._matDialog.open(AddActivityAbsenceDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
