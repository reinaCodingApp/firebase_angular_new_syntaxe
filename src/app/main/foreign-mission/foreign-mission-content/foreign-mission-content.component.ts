import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ForeignMissionService } from '../foreign-mission.service';
import { AddForeignMissionDialogComponent } from '../dialogs/add-foreign-mission-dialog/add-foreign-mission-dialog.component';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'foreign-mission-content',
  templateUrl: './foreign-mission-content.component.html',
  styleUrls: ['./foreign-mission-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForeignMissionContentComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  smallScreen: boolean;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private _foreignMissionService: ForeignMissionService,
    private _loaderService: NgxUiLoaderService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.loadingIndicator = true;
    this.reorderable = true;
  }

  ngOnInit(): void {
    this._foreignMissionService.onForeignMissionsChanged
      .subscribe(foreignMissions => {
        this.rows = [...foreignMissions];
        this.loadingIndicator = false;
        if (this.table) {
          this.table.offset = 0;
        }
      });
    this.breakpointObserver
      .observe(['(min-width: 872px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }
      });
    this._foreignMissionService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  updateForeignMission(row: ForeignMissionActivity): void {
    const currentForeignMission = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(AddForeignMissionDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        foreignMission: currentForeignMission
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }

  deleteForeignMission(foreinMission: ForeignMissionActivity): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression mission',
        message: 'Etes-vous sûr de vouloir de supprimer cette mission ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
          this._loaderService.start();
          this._foreignMissionService.deleteForeignMission(foreinMission.id).subscribe((result) => {
            this._loaderService.stop();
            if (result){
              const deletedAdvanceSalaryIndex = this.rows.findIndex(x => x.id === foreinMission.id);
              this.rows.splice(deletedAdvanceSalaryIndex, 1);
              this._foreignMissionService.onForeignMissionsChanged.next(JSON.parse(JSON.stringify(this.rows)));
            }
          }, (err) => {
            console.log(err);
            this._loaderService.stop();
          });
        }
      });
  }

}

