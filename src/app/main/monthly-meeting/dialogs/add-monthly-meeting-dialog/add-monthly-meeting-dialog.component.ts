import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MonthlyMeeting } from '../../models/monthlyMeeting';
import { MonthlyMeetingService } from '../../monthly-meeting.service';

@Component({
  selector: 'app-add-monthly-meeting-dialog',
  templateUrl: './add-monthly-meeting-dialog.component.html',
  styleUrls: ['./add-monthly-meeting-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMonthlyMeetingDialogComponent implements OnInit {
  monthlyMeeting: MonthlyMeeting;
  monthlyMeetings: MonthlyMeeting[];

  constructor(
    public matDialogRef: MatDialogRef<AddMonthlyMeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private monthlyMeetingService: MonthlyMeetingService,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === 'edit') {
      this.monthlyMeeting = data.monthlyMeeting;
    } else {
      this.monthlyMeeting = new MonthlyMeeting();
    }

  }

  ngOnInit(): void {
    this.monthlyMeetingService.onMonthlyMeetingsChanged.subscribe((monthlyMeetings) => {
      this.monthlyMeetings = monthlyMeetings;
    });
  }

  addMonthlyMeeting(): void {
    this._loaderService.start();
    this.monthlyMeetingService.addMonthlyMeeting(this.monthlyMeeting)
      .subscribe((createdMonthlyMeetingId) => {
        this._loaderService.stop();
        this.matDialogRef.close();
        this.monthlyMeeting.id = createdMonthlyMeetingId;
        this.monthlyMeetings.push(this.monthlyMeeting);
        this.monthlyMeetingService.onMonthlyMeetingsChanged.next(JSON.parse(JSON.stringify(this.monthlyMeetings)));
        this._notificationService.showSuccess('Ajout terminé avec succès');
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  updateMonthlyMeeting(): void {
    this._loaderService.start();
    this.monthlyMeetingService.updateMonthlyMeeting(this.monthlyMeeting)
      .subscribe((response) => {
        if (response) {
          this._loaderService.stop();
          this.matDialogRef.close();
          this._notificationService.showSuccess('Modification terminée avec succès');
          const foundIndex = this.monthlyMeetings.findIndex(x => x.id === this.monthlyMeeting.id);
          this.monthlyMeetings[foundIndex] = this.monthlyMeeting;
          this.monthlyMeetingService.onMonthlyMeetingsChanged.next(JSON.parse(JSON.stringify(this.monthlyMeetings)));
        } else {
          this._notificationService.showStandarError();
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateMonthlyMeeting();
      } else {
        this.addMonthlyMeeting();
      }
    }
  }

}




