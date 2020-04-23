import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MeetingsService } from '../../meetings.service';
import { Decision } from 'app/main/meetings/models/decision';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { NgForm } from '@angular/forms';
import { GeneratedTask } from 'app/main/meetings/models/generatedTask';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { RequestParameter } from 'app/main/meetings/models/requestParameter';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { SimpleTaskItem } from 'app/main/meetings/models/simpleTaskItem';

@Component({
  selector: 'app-reaffect-task-dialog',
  templateUrl: './reaffect-task-dialog.component.html',
  styleUrls: ['./reaffect-task-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReaffectTaskDialogComponent implements OnInit {
  task: GeneratedTask;
  employees: EmployeeLevel[];
  selectedEmployee: EmployeeLevel;
  instances: MeetInstance[];
  selectedInstance: MeetInstance;
  selectedDate: any;

  constructor(
    public matDialogRef: MatDialogRef<ReaffectTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _meetingsService: MeetingsService
  ) {
    this.task = data.task;
  }

  ngOnInit(): void {
    this._meetingsService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
    });
    this._meetingsService.onInstancesChanged.subscribe((instances) => {
      this.instances = instances;
      this.selectedInstance = this.instances[0];
    });
  }

  reaffectGeneratedTask(form: NgForm): void {
    if (form.valid) {
      const requestParamter: RequestParameter = {
        task: this.task,
        employee: this.selectedEmployee
      };
      this._loaderService.start();
      this._meetingsService.reaffectGeneratedTask(requestParamter)
        .subscribe(() => {
          this._loaderService.stop();
          this.matDialogRef.close({
            success: true,
            data: {
              type: 'reaffect',
              employee: this.selectedEmployee
            }
          });

          this._notificationService.showSuccess('Opération terminée avec succés');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  updateGeneratedTaskDeadline(form: NgForm): void {
    if (form.valid) {
      const requestParamter: RequestParameter = {
        task: this.task,
        date: this.selectedDate
      };
      this._loaderService.start();
      this._meetingsService.updateGeneratedTaskDeadline(requestParamter)
        .subscribe((result) => {
          if (result.response) {
            this._loaderService.stop();
            this.matDialogRef.close({
              success: true,
              data: {
                type: 'deadline',
                endDate: result.endDate
              }
            });
            this._notificationService.showSuccess('Opération terminée avec succés');
          }
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  changeTaskInstance(form: NgForm): void {
    if (form.valid) {
      const requestParamter: RequestParameter = {
        task: this.task,
        instance: this.selectedInstance
      };
      this._loaderService.start();
      this._meetingsService.changeTaskInstance(requestParamter)
        .subscribe((response) => {
          this._loaderService.stop();
          if (response) {
            this.matDialogRef.close({
              success: true,
              data: {
                type: 'changeInstance',
              }
            });
            this._notificationService.showSuccess('Opération terminée avec succés');
          }
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }


}




