import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { ForeignMissionService } from '../../foreign-mission.service';
import { Employee } from 'app/common/models/employee';
import { Site } from 'app/common/models/site';
import { CommonService } from 'app/common/services/common.service';
import * as moment from 'moment';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'app-add-foreign-mission-dialog',
  templateUrl: './add-foreign-mission-dialog.component.html',
  styleUrls: ['./add-foreign-mission-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddForeignMissionDialogComponent implements OnInit {
  foreignMission: ForeignMissionActivity;
  employees: Employee[];
  filtredEmployees: Employee[];
  sites: Site[];

  constructor(
    public matDialogRef: MatDialogRef<AddForeignMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _foreignMissionService: ForeignMissionService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.foreignMission = data.foreignMission;
      this.foreignMission.departingDate = MainTools.convertStringtoDateTime(this.foreignMission.departingDate);
      this.foreignMission.returningDate = MainTools.convertStringtoDateTime(this.foreignMission.returningDate);
    } else {
      this.foreignMission = new ForeignMissionActivity();
    }

  }

  ngOnInit(): void {
    this._foreignMissionService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
      this.filtredEmployees = employees;
    });
    this._foreignMissionService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
    });
  }

  addForeignMission(): void {
    this._loaderService.start();
    const foreignMission = JSON.parse(JSON.stringify(this.foreignMission));
    foreignMission.departingDate = moment(foreignMission.departingDate).format('DD/MM/YYYY HH:mm');
    foreignMission.returningDate = moment(foreignMission.returningDate).format('DD/MM/YYYY HH:mm');
    this._foreignMissionService.addForeignMission(foreignMission).subscribe(() => {
      this.matDialogRef.close();
      this._notificationService.showSuccess('Mission crée avec succés');
      this._foreignMissionService.refreshData();
      this._loaderService.stop();
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
      this._loaderService.stop();
    });
  }

  updateForeignMission(): void {
    this._loaderService.start();
    const foreignMission = JSON.parse(JSON.stringify(this.foreignMission));
    foreignMission.departingDate = moment(foreignMission.departingDate).format('DD/MM/YYYY HH:mm');
    foreignMission.returningDate = moment(foreignMission.returningDate).format('DD/MM/YYYY HH:mm');
    this._foreignMissionService.updateForeignMission(foreignMission).subscribe(() => {
      this.matDialogRef.close();
      this._notificationService.showSuccess('Mission modifiée avec succés');
      this._foreignMissionService.refreshData();
      this._loaderService.stop();
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
      this._loaderService.stop();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateForeignMission();
      } else {
        this.addForeignMission();
      }
    }
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}

