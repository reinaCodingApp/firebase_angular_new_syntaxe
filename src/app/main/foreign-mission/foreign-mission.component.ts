import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { AddForeignMissionDialogComponent } from './dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ForeignMissionService } from './foreign-mission.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-foreign-mission',
  templateUrl: './foreign-mission.component.html',
  styleUrls: ['./foreign-mission.component.scss'],
  animations: fuseAnimations
})
export class ForeignMissionComponent implements OnInit {
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _foreignMissionService: ForeignMissionService,
    public commonService: CommonService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._foreignMissionService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
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
