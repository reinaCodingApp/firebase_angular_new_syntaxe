import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { ActivityTemporaryWorkerService } from './activity-temporary-workers.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from '../access-rights/models/habilitation';
import { AddActivityTemporaryWorkerDialogComponent } from './dialogs/add-activity-temporary-worker-dialog/add-activity-temporary-worker-dialog.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity-temporary-workers.component.html',
  styleUrls: ['./activity-temporary-workers.component.scss'],
  animations: fuseAnimations
})
export class ActivityTemporaryWorkerComponent implements OnInit {
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public commonService: CommonService,
    private _activityService: ActivityTemporaryWorkerService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._activityService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  addActivity(): void {
    this.dialogRef = this._matDialog.open(AddActivityTemporaryWorkerDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
  }

}
