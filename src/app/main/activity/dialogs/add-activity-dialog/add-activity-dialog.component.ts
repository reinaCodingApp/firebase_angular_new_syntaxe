import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Activity } from 'app/main/activity/models/activity';
import { Site } from 'app/common/models/site';
import { ActivityService } from '../../activity.service';
import * as moment from 'moment';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { take } from 'rxjs/operators';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html',
  styleUrls: ['./add-activity-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddActivityDialogComponent implements OnInit {
  activity: Activity;
  employees: CompleteEmployee[];
  filtredEmployees: CompleteEmployee[];
  sites: Site[];
  filtredSites: Site[];

  constructor(
    public matDialogRef: MatDialogRef<AddActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _activityService: ActivityService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.activity = data.activity;
      this.initToUpdateActivity();
    } else {
      this.initNewActivity();
    }

  }

  ngOnInit(): void {
    this._activityService.getEmployeesAndSites().pipe(take(1))
      .toPromise().then((data) => {
        this.employees = data.employees;
        this.filtredEmployees = data.employees;
        this.sites = data.sites;
        this.filtredSites = data.sites;
      });
  }

  addActivity(): void {
    const activityToAdd: Activity = {
      startTime: moment(this.activity.startTime).format('LT'),
      endTime: this.activity.endTime != null ? moment(this.activity.endTime).format('LT') : '',
      startDate: moment(this.activity.startDate).format('L'),
      employee: this.activity.employee,
      site: this.activity.site,
      title: this.activity.title,
      isTemporaryWorker: false,
    };
    this._activityService.addAtivity(activityToAdd).subscribe((response) => {
      if (response.id !== -1) {
        this._notificationService.showSuccess('Insertion enregistrée');
      } else {
        this._notificationService.showError(`Opération refusée en raison d'incohérence des données`);
      }
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  updateActivity(): void {
    const activityToUpdate: Activity = JSON.parse(JSON.stringify(this.activity));
    activityToUpdate.startDate = moment(this.activity.startDate).format('L');
    activityToUpdate.startTime = moment(this.activity.startTime).format('LT');
    activityToUpdate.endTime = this.activity.endTime != null ? moment(this.activity.endTime).format('LT') : '',
      this._activityService.updateActivity(activityToUpdate).subscribe((updatedActivity) => {
        if (updatedActivity.id !== -1) {
          this._notificationService.showSuccess('Modification enregistrée');
          this.matDialogRef.close({ success: true, data: updatedActivity });
        } else {
          this._notificationService.showError(`Opération refusée en raison d'incohérence des données`);
        }
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateActivity();
      } else {
        this.addActivity();
      }
    }
  }

  initNewActivity(): void {
    this.activity = new Activity();
    this.activity.startTime = moment().hour(9).minutes(0);
    this.activity.endTime = moment().hour(17).minutes(0);
    this.activity.startDate = moment(Date.now());
  }

  initToUpdateActivity(): void {
    this.activity.startDate = MainTools.convertStringtoDate(this.activity.startDate);
    if (this.activity.startTime != null) {
      this.activity.startTime = MainTools.convertStringToTime(this.activity.startTime);
    }
    if (this.activity.endTime != null) {
      this.activity.endTime = MainTools.convertStringToTime(this.activity.endTime);
    }
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

  searchSite(searchInput): void {
    if (!this.sites) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredSites = this.sites.filter(s => s.name.toLowerCase().indexOf(searchInput) > -1);
  }

}


