import { Component, OnInit } from '@angular/core';
import { ActivityParametersService } from '../activity-parameters.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Holiday } from 'app/main/activity-parameters/models/holiday';
import { MatDialog } from '@angular/material';
import { AddHolidayDialogComponent } from './dialogs/add-holiday-dialog/add-holiday-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'parameters-holidays',
  templateUrl: './parameters-holidays.component.html',
  styleUrls: ['./parameters-holidays.component.scss']
})
export class ParametersHolidaysComponent implements OnInit {
  acitvityHolidays: Holiday[];
  displayedColumns = ['title', 'date', 'static', 'actions'];
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityParamatersService: ActivityParametersService,
    private _matDialog: MatDialog,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService) {
    this.acitvityHolidays = [];
  }

  ngOnInit(): void {
    if (this.acitvityHolidays.length === 0) {
      this.getActivityHolidays();
    }
    this._activityParamatersService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getActivityHolidays(): void {
    this._activityParamatersService.getActivityHolidays()
      .subscribe((acitvityHolidays) => {
        this.acitvityHolidays = acitvityHolidays;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  addOrUpdateActivityHoliday(mode: string, activityHoliday = null): void {
    let holiday: Holiday;
    if (mode === 'edit') {
      holiday = JSON.parse(JSON.stringify(activityHoliday));
    } else {
      holiday = activityHoliday;
    }
    this.dialogRef = this._matDialog.open(AddHolidayDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: mode,
        activityHoliday: holiday
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          this._loaderService.stop();
          this.getActivityHolidays();
        }
      });
  }

  deleteActivityHoliday(currentActivityHoliday: Holiday): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer jour férié',
        message: 'Confirmez-vous la suppression de ce jour férié ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._activityParamatersService.deleteActivityHoliday(currentActivityHoliday.id)
            .subscribe(() => {
              this._loaderService.stop();
              this.getActivityHolidays();
            }, (err) => {
              console.log(err);
              this._loaderService.stop();
            });
        }
      });
  }


}


