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
  selector: 'app-generate-task-dialog',
  templateUrl: './generate-task-dialog.component.html',
  styleUrls: ['./generate-task-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenerateTaskDialogComponent implements OnInit {
  task: GeneratedTask;
  employees: EmployeeLevel[];
  selectedEmployees: EmployeeLevel[];
  instances: MeetInstance[];
  selectedInstance: MeetInstance;
  point: SimpleTaskItem;

  constructor(
    public matDialogRef: MatDialogRef<GenerateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
    private _meetingsService: MeetingsService
  ) {
    this.task = new GeneratedTask();
    this.task.simpleTaskItemId = data.simpleTaskItemId;
    this.point = data.point;
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

  generateTask(form: NgForm): void {
    if (form.valid) {
      const requestParamter: RequestParameter = {
        task: this.task,
        compactEmployeeLevels: this.selectedEmployees
      };
      this._loaderService.start();
      this._meetingsService.generateTask(requestParamter)
        .subscribe((createdDecision) => {
          this._loaderService.stop();
          this.matDialogRef.close();
          this._notificationService.showSuccess('Opération terminée avec succés');
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
          this._notificationService.showStandarError();
        });
    }
  }

  changePointInstance(form: NgForm): void {
    if (form.valid) {
      const requestParamter: RequestParameter = {
        point: this.point,
        instance: this.selectedInstance
      };
      this._loaderService.start();
      this._meetingsService.changePointInstance(requestParamter)
        .subscribe((response) => {
          this._loaderService.stop();
          if (response) {
            this.matDialogRef.close({success: true});
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



