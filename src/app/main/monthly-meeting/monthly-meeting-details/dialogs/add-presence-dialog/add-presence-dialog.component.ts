import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MonthlyMeetingPresence } from 'app/main/monthly-meeting/models/monthlyMeetingPresence';
import { MonthlyMeeting } from 'app/main/monthly-meeting/models/monthlyMeeting';
import { MonthlyMeetingService } from 'app/main/monthly-meeting/monthly-meeting.service';
import { Employee } from 'app/common/models/employee';
import * as moment from 'moment';
import { CommonService } from 'app/common/services/common.service';
import { MainTools } from 'app/common/tools/main-tools';

@Component({
  selector: 'app-add-presence-dialog',
  templateUrl: './add-presence-dialog.component.html',
  styleUrls: ['./add-presence-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPresenceDialogComponent implements OnInit {
  monthlyMeetingPresence: MonthlyMeetingPresence;
  monthlyMeeting: MonthlyMeeting;
  employees: Employee[];
  filtredEmployees: Employee[];

  constructor(
    public matDialogRef: MatDialogRef<AddPresenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private monthlyMeetingService: MonthlyMeetingService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    this.monthlyMeeting = data.monthlyMeeting;
    if (data.mode === 'edit') {
      this.monthlyMeetingPresence = data.monthlyMeetingPresence;
      this.monthlyMeetingPresence.start = MainTools.convertStringtoDateTime(this.monthlyMeetingPresence.start);
      this.monthlyMeetingPresence.end = MainTools.convertStringtoDateTime(this.monthlyMeetingPresence.end);
    } else {
      this.monthlyMeetingPresence = new MonthlyMeetingPresence();
    }

  }

  ngOnInit(): void {
    this.monthlyMeetingService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
      this.filtredEmployees = employees;
    });
  }

  addMonthlyMeetingPresence(): void {
    if (!this.employeeAlreadyExist()) {
      this._loaderService.start();
      this.monthlyMeetingPresence.monthlyMeetingId = this.monthlyMeeting.id;
      const monthlyMeetingPresence = JSON.parse(JSON.stringify(this.monthlyMeetingPresence));
      monthlyMeetingPresence.start = moment(monthlyMeetingPresence.start).format('DD/MM/YYYY HH:mm');
      monthlyMeetingPresence.end = moment(monthlyMeetingPresence.end).format('DD/MM/YYYY HH:mm');
      this.monthlyMeetingService.addMonthlyMeetingPresence(monthlyMeetingPresence)
        .subscribe((createdpresence) => {
          this._loaderService.stop();
          this.matDialogRef.close();
          const employee = this.employees.find(e => {
            return e.id === this.monthlyMeetingPresence.employeeId;
          });
          createdpresence.employee = employee;
          this.monthlyMeeting.monthlyMeetingPresences.push(createdpresence);
          this.monthlyMeetingService.currentMonthlyMeetingChanged.next(JSON.parse(JSON.stringify(this.monthlyMeeting)));
          this._notificationService.showSuccess('Ajout terminé avec succès');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    } else {
      this._notificationService.showWarning('Cet employé existe déjà');
    }

  }

  updateMonthlyMeetingPresence(): void {
    this._loaderService.start();
    this.monthlyMeetingService.updateMonthlyMeetingPresence(this.monthlyMeetingPresence)
      .subscribe((updatedPresence) => {
        this._loaderService.stop();
        this.matDialogRef.close();
        this._notificationService.showSuccess('Modification terminée avec succès');
        const employee = this.employees.find(e => {
          return e.id === this.monthlyMeetingPresence.employeeId;
        });
        updatedPresence.employee = employee;
        const foundIndex = this.monthlyMeeting.monthlyMeetingPresences.findIndex(x => x.id === this.monthlyMeetingPresence.id);
        this.monthlyMeeting.monthlyMeetingPresences[foundIndex] = updatedPresence;
        this.monthlyMeetingService.currentMonthlyMeetingChanged.next(JSON.parse(JSON.stringify(this.monthlyMeeting)));

      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateMonthlyMeetingPresence();
      } else {
        this.addMonthlyMeetingPresence();
      }
    }
  }

  employeeAlreadyExist(): boolean {
    const employee = this.monthlyMeeting.monthlyMeetingPresences.find(e => {
      return e.employee.id === this.monthlyMeetingPresence.employeeId;
    });
    return employee !== undefined;
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}





