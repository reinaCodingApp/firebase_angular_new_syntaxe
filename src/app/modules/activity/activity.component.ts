import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { ActivityService } from './activity.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from '../access-rights/models/habilitation';
import { AddActivityDialogComponent } from './dialogs/add-activity-dialog/add-activity-dialog.component';
import { ActivityParameters } from './models/activityParameters';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent implements OnInit {
  @ViewChild("drawer") drawer: MatDrawer;

  private dialogRef: any;
  activityParameters: ActivityParameters;
  habilitation: Habilitation = new Habilitation(0);
  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  
  constructor(
    public commonService: CommonService,
    private _activityService: ActivityService,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
      this._unsubscribeAll = new Subject();
    }


  ngOnInit(): void {
    this._activityService.onActivityParametersChanged.subscribe((activityParameters) => {
      this.activityParameters = activityParameters;
    });
    this._activityService.onHabilitationLoaded
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

  addActivity(): void {
    this.dialogRef = this._matDialog.open(AddActivityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
  }

}
