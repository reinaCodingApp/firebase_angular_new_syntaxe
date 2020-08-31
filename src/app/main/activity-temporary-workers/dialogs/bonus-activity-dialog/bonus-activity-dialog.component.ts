import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivityTemporaryWorkerService } from '../../activity-temporary-workers.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Activity } from 'app/main/activity/models/activity';
import { BonusCategory } from 'app/main/activity/models/bonusCategory';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bonus-activity-dialog',
  templateUrl: './bonus-activity-dialog.component.html',
  styleUrls: ['./bonus-activity-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BonusActivityDialogComponent implements OnInit {
  activity: Activity;
  bonusCategories: BonusCategory[];

  constructor(
    public matDialogRef: MatDialogRef<BonusActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _activityService: ActivityTemporaryWorkerService,
    private _notificationService: SharedNotificationService
  ) {
    this.activity = data.activity;
  }

  ngOnInit(): void {
    this._activityService.onBonusCategoriesChanged
      .subscribe((bonusCategories) => {
        this.bonusCategories = bonusCategories;
      });
  }

  updateBonusCategory(form: NgForm): void {
    if (form.valid && this.activity.bonusCategory.id !== 0) {
      this._loaderService.start();
      this._activityService.updateBonusCategory(this.activity).subscribe((updatedActivity) => {
        this._loaderService.stop();
        this.matDialogRef.close({ success: true, data: updatedActivity });
        this._notificationService.showSuccess('Prime crée avec succés');
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
    }
  }

}
