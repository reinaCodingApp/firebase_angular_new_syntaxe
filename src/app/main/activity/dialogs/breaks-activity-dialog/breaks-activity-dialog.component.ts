import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivityService } from '../../activity.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Activity } from 'app/main/activity/models/activity';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Break } from 'app/main/activity/models/break';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'app-breaks-activity-dialog',
  templateUrl: './breaks-activity-dialog.component.html',
  styleUrls: ['./breaks-activity-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreaksActivityDialogComponent implements OnInit {
  activity: Activity;
  activityBreaks: Break[] = [];

  constructor(
    public matDialogRef: MatDialogRef<BreaksActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _activityService: ActivityService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    this.activity = data.activity;
  }

  ngOnInit(): void {
    this.activity.breaks.forEach(activityBreak => {
      const startTime = MainTools.convertStringToTime(activityBreak.startTime);
      const endTime = MainTools.convertStringToTime(activityBreak.endTime);
      activityBreak.startTime = startTime;
      activityBreak.endTime = endTime;
      this.activityBreaks.push(activityBreak);
    });
  }

  updateBreaksActivity(form: NgForm): void {
    if (form.valid) {
      const activityBreaksToUpdate: Break[] = JSON.parse(JSON.stringify(this.activityBreaks));
      activityBreaksToUpdate.forEach(activityBreak => {
        const startTime = moment(activityBreak.startTime).format('LT');
        const endTime = moment(activityBreak.endTime).format('LT');
        activityBreak.startTime = startTime;
        activityBreak.endTime = endTime;
      });
      this.activity.breaks = activityBreaksToUpdate;
      this._activityService.updateBreaksActivity(this.activity).subscribe((updatedActivity) => {
        this.matDialogRef.close({ success: true, data: updatedActivity });
        this._notificationService.showSuccess('Pause crée avec succés');
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
    }
  }

  resetActivityBreak(index: number): void {
    const startTime = MainTools.convertStringToTime('00:00');
    const endTime = MainTools.convertStringToTime('00:00');
    this.activityBreaks[index].startTime = startTime;
    this.activityBreaks[index].endTime = endTime;
  }

}

