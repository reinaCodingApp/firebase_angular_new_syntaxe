import { AppService } from 'app/app.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { AddActivityAbsenceDialogComponent } from './dialogs/add-activity-absence-dialog/add-activity-absence-dialog.component';
import { ActivityAbsenceService } from './activity-absence.service';
import { Habilitation } from '../access-rights/models/habilitation';

@Component({
  selector: 'app-activity-absence',
  templateUrl: './activity-absence.component.html',
  styleUrls: ['./activity-absence.component.scss'],
  animations: fuseAnimations
})
export class ActivityAbsenceComponent implements OnInit {
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityAbsenceService: ActivityAbsenceService,
    public commonService: CommonService,    
    private _matDialog: MatDialog) {            
      
    }

  ngOnInit(): void {
    this._activityAbsenceService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
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

}
