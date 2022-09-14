import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from '../../activity.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Activity } from '../../models/activity';
import { Break } from '../../models/break';

@Component({
  selector: 'app-breaks-activity-dialog',
  templateUrl: './breaks-activity-dialog.component.html'
})
export class BreaksActivityDialogComponent implements OnInit {
  activity: Activity;
  activityBreaks: Break[] = [];

  constructor(
    public matDialogRef: MatDialogRef<BreaksActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _activityService: ActivityService,
    private _notificationService: SharedNotificationService
  ) {
    this.activity = data.activity;
  }

  ngOnInit(): void {
    console.log(this.activity.breaks);
    this.activity.breaks.forEach(activityBreak => {
      this.activityBreaks.push(activityBreak);
    });
  }

  updateBreaksActivity(form: NgForm): void {
    if (form.valid) {
      this.activity.breaks = this.activityBreaks;
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
    this.activityBreaks[index].startTime = '00:00';
    this.activityBreaks[index].endTime = '00:00';
  }

}

