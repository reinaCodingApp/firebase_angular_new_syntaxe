import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Holiday } from 'app/main/activity-parameters/models/holiday';
import { ActivityParametersService } from 'app/main/activity-parameters/activity-parameters.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-holiday-dialog',
  templateUrl: './add-holiday-dialog.component.html',
  styleUrls: ['./add-holiday-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddHolidayDialogComponent implements OnInit {
  activityHoliday: Holiday;

  constructor(
    public matDialogRef: MatDialogRef<AddHolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _activityParametersService: ActivityParametersService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.activityHoliday = data.activityHoliday;
    } else {
      this.activityHoliday = new Holiday();
    }
  }

  ngOnInit(): void {
  }

  addActivityHoliday(): void {
    this._loaderService.start();
    this.activityHoliday.date = moment(this.activityHoliday.date).format('YYYY-MM-DD');
    this._activityParametersService.addActivityHoliday(this.activityHoliday)
      .subscribe((addedActivityHoliday) => {
        this.matDialogRef.close(true);
        this._notificationService.showSuccess('Jour férié crée avec succés');
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  updateActivityHoliday(): void {
    this._loaderService.start();
    this.activityHoliday.date = moment(this.activityHoliday.date).format('YYYY-MM-DD');
    this._activityParametersService.updateActivityHoliday(this.activityHoliday)
      .subscribe((updateActivityHoliday) => {
        this.matDialogRef.close(true);
        this._notificationService.showSuccess('Jour férié modifié avec succés');
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateActivityHoliday();
      } else {
        this.addActivityHoliday();
      }
    }
  }

}

