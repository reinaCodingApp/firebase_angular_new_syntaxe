import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { ActivityService } from './activity.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from '../access-rights/models/habilitation';
import { AddActivityDialogComponent } from './dialogs/add-activity-dialog/add-activity-dialog.component';
import { ActivityParameters } from './models/activityParameters';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  animations: fuseAnimations
})
export class ActivityComponent implements OnInit {
  private dialogRef: any;
  activityParameters: ActivityParameters;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public commonService: CommonService,
    private _activityService: ActivityService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._activityService.onActivityParametersChanged.subscribe((activityParameters) => {
      this.activityParameters = activityParameters;
    });
    this._activityService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
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
