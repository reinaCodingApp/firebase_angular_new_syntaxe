import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivityService } from '../../activity.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Activity } from 'app/main/activity/models/activity';
import { NgForm } from '@angular/forms';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { Site } from 'app/common/models/site';
import * as moment from 'moment';
import { ActivityAbsence } from 'app/main/activity/models/activityAbsence';
import { AbsenceType } from 'app/main/activity/models/absenceType';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { ActivityAbsenceService } from 'app/main/activity-absence/activity-absence.service';

@Component({
  selector: 'app-add-activity-temporary-worker-dialog',
  templateUrl: './add-activity-temporary-worker-dialog.component.html',
  styleUrls: ['./add-activity-temporary-worker-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddActivityTemporaryWorkerDialogComponent implements OnInit {
  activity: Activity;
  activityAbsence: ActivityAbsence;
  foreignMission: ForeignMissionActivity;

  employees: CompleteEmployee[];
  filtredEmployees: CompleteEmployee[];
  sites: Site[];
  filtredSites: Site[];
  activityAbsenceTypes: AbsenceType[];

  constructor(
    public matDialogRef: MatDialogRef<AddActivityTemporaryWorkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _activityService: ActivityService,
    private _activityAbsenceService: ActivityAbsenceService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    this.activity = new Activity();
    this.initNewActivity();

    this.activityAbsence = new ActivityAbsence();
    this.foreignMission = new ForeignMissionActivity();
  }

  ngOnInit(): void {
    this._activityService.onAllEmployeesChanged.subscribe((allEmployyes) => {
      this.employees = allEmployyes;
      this.filtredEmployees = allEmployyes;
    });
    this._activityService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
      this.filtredSites = sites;
    });
    this._activityService.onAbsenceTypesChanged.subscribe((activityAbsenceTypes) => {
      this.activityAbsenceTypes = activityAbsenceTypes;
    });
  }

  initNewActivity(): void {
    this.activity = new Activity();
    this.activity.startTime = moment().hour(9).minutes(0);
    this.activity.endTime = moment().hour(17).minutes(0);
    this.activity.startDate = moment(Date.now());
  }

  addActivity(form: NgForm, isAbsence: boolean): void {
    if (form.valid) {
      this._loaderService.start();
      const activityToAdd: Activity = {
        startTime: moment(this.activity.startTime).format('LT'),
        endTime: this.activity.endTime != null ? moment(this.activity.endTime).format('LT') : '',
        startDate: moment(this.activity.startDate).format('L'),
        employee: this.activity.employee,
        site: isAbsence ? { id: 0 } : this.activity.site,
        title: this.activity.title,
        isTemporaryWorker: true,
        activityType: isAbsence ? 2 : 1,
        absenceType: this.activityAbsence.absenceType,
      };
      if (isAbsence) {
        activityToAdd.startDate = moment(this.activityAbsence.startDate).format('L');
        activityToAdd.endDate = moment(this.activityAbsence.endDate).format('L');
        activityToAdd.employee = this.activityAbsence.employee;
      }
      this._activityService.addAtivity(activityToAdd).subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          this._notificationService.showSuccess(`L'insertion a eu lieu avec succès.`);
        } else if (!response && isAbsence) {
          this._notificationService.showWarning(`L'insertion a échoué, le salarié a-t-il déjà un pointage pendant la plage de dates sélectionnée`);
        } else if (!response && !isAbsence) {
          this._notificationService.showWarning(`Opération refusée en raison d'incohérence des données`);
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
    }
  }

  addForeignMission(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this._activityService.addForeignMission(this.foreignMission).subscribe(() => {
        this.matDialogRef.close();
        this._notificationService.showSuccess('Mission crée avec succés');
        this._loaderService.stop();
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
        this._loaderService.stop();
      });
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

