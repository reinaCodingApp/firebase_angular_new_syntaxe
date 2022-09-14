import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Employee } from 'app/common/models/employee';
import { ActivityAbsenceService } from '../../activity-absence.service';
import { take } from 'rxjs/operators';
import { MainTools } from 'app/common/tools/main-tools';
import { AbsenceType } from 'app/modules/activity/models/absenceType';
import { ActivityAbsence } from 'app/modules/activity/models/activityAbsence';

@Component({
  selector: 'app-add-activity-absence-dialog',
  templateUrl: './add-activity-absence-dialog.component.html'
})
export class AddActivityAbsenceDialogComponent implements OnInit {
  activityAbsence: ActivityAbsence;
  employees: Employee[];
  filtredEmployees: Employee[];
  activityAbsenceTypes: AbsenceType[];

  constructor(
    public matDialogRef: MatDialogRef<AddActivityAbsenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _activityAbsenceService: ActivityAbsenceService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.activityAbsence = data.activityAbsence;
      this.activityAbsence.startDate = MainTools.convertStringtoDate(this.activityAbsence.startDate);
      this.activityAbsence.endDate = MainTools.convertStringtoDate(this.activityAbsence.endDate);
    } else {
      if (this._activityAbsenceService.activityAbsence) {
        this.activityAbsence = _activityAbsenceService.activityAbsence;
      } else {
        this.activityAbsence = new ActivityAbsence();
      }
    }

  }

  ngOnInit(): void {
    this._activityAbsenceService.onAbsencesMainViewModel.subscribe((absencesMainViewMode) => {
      this.employees = absencesMainViewMode.employees;
      this.filtredEmployees = absencesMainViewMode.employees;
      this.activityAbsenceTypes = absencesMainViewMode.activityAbsenceTypes;
    });
  }

  addActivityAbsence(): void {
    this._activityAbsenceService.addaAtivityAbsence(this.activityAbsence)
    .pipe(take(1))
    .subscribe((response) => {
      if (!response.hasOwnProperty('statusCode')) {
        this._notificationService.showSuccess('Absence crée avec succés');
        this._activityAbsenceService.refreshData();
        this._activityAbsenceService.activityAbsence = this.activityAbsence;
      } else {
        this._notificationService.showWarning(`Impossible d'ajouter une absence à cette date !`);
      }
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  updateActivityAbsence(): void {
    this._activityAbsenceService.updateActivityAbsence(this.activityAbsence)
    .pipe(take(1))
    .subscribe((response) => {
      if (!response.hasOwnProperty('statusCode')) {
        this.matDialogRef.close();
        this._notificationService.showSuccess('Absence modifiée avec succés');
        this._activityAbsenceService.refreshData();
      } else {
        this._notificationService.showWarning(`Impossible d'ajouter une absence à cette date !`);
      }
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateActivityAbsence();
      } else {
        this.addActivityAbsence();
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

