import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from '../../activity.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { NgForm } from '@angular/forms';
import { Activity } from '../../models/activity';
import { BonusCategory } from '../../models/bonusCategory';
import { ReplacementBonusCategory } from '../../models/replacementBonusCategory';

@Component({
  selector: 'app-bonus-activity-dialog',
  templateUrl: './bonus-activity-dialog.component.html'
})
export class BonusActivityDialogComponent implements OnInit {
  activity: Activity;
  bonusCategories: BonusCategory[];
  replacementBonusCategories: ReplacementBonusCategory[];

  constructor(
    public matDialogRef: MatDialogRef<BonusActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _activityService: ActivityService,
    private _notificationService: SharedNotificationService
  ) {
    this.activity = data.activity;
  }

  ngOnInit(): void {
    this._activityService.onBonusCategoriesChanged
      .subscribe((bonusCategories) => {
        this.bonusCategories = bonusCategories;
      });
    this._activityService.onReplacementBonusCategoriesChanged
      .subscribe((replacementBonusCategories) => {
        this.replacementBonusCategories = replacementBonusCategories;
      });
  }

  updateBonusCategory(form: NgForm): void {
    if (form.valid && this.activity.bonusCategory.id !== 0) {
      this._activityService.updateBonusCategory(this.activity).subscribe((updatedActivity) => {
        this.matDialogRef.close({ success: true, data: updatedActivity });
        this._notificationService.showSuccess('Prime crée avec succés');
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
    }
  }

  updateReplacementBonusCategory(form: NgForm): void {
    if (form.valid && this.activity.replacementBonusCategory.id !== 0) {
      this._activityService.updateReplacementBonusCategory(this.activity)
        .subscribe((updatedActivity) => {
          this.matDialogRef.close({ success: true, data: updatedActivity });
          this._notificationService.showSuccess('Prime crée avec succés');
        }, (err) => {
          console.log(err);
          this._notificationService.showStandarError();
        });
    }
  }

}
