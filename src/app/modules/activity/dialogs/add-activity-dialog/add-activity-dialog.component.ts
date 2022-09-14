import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Site } from 'app/common/models/site';
import { ActivityService } from '../../activity.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { MainTools } from 'app/common/tools/main-tools';
import { Activity } from '../../models/activity';
import { CompleteEmployee } from '../../models/completeEmployee';

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html'
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
      console.log(this.activity);
      this.activity.startDate = moment(this.activity.startDate, 'DD/MM/YYYY').toDate()
      console.log('this.activity.startDate ', this.activity.startDate);
      // this.activity.startTime =  this.activity.startTime != null ? ""+`${moment(this.activity.startTime).hour()}`+":"+
      // `${moment(this.activity.startTime).minutes()}`
      //  : '';
      // this.activity.startTime = '11:11';
      // this.activity.endTime= this.activity.endTime != null ? moment(this.activity.endTime).format('HH:mm').toString() : '';
      // this.initToUpdateActivity();
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
    const param: Activity = {
      startTime: this.activity.startTime,
      endTime: this.activity.endTime != null ? this.activity.endTime : '',
      startDate: moment(this.activity.startDate).format('DD/MM/YYYY'),
      employee: this.activity.employee,
      site: this.activity.site,
      title: this.activity.title,
      isTemporaryWorker: false,
    };
    this._activityService.addAtivity(param).subscribe((response) => {
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
    const param = {... this.activity, startDate: moment(this.activity.startDate).format('DD/MM/YYYY')} as Activity
    this._activityService.updateActivity(param).subscribe((updatedActivity) => {
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
    this.activity.startTime = "9:00";
    this.activity.endTime = "17:00";    
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