import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { ActivityTemporaryWorkerService } from '../../activity-temporary-workers.service';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { Department } from 'app/common/models/department';
import { Provider } from 'app/main/activity/models/provider';
import { MainTools } from 'app/common/tools/main-tools';


@Component({
  selector: 'app-add-temporary-worker-dialog',
  templateUrl: './add-temporary-worker-dialog.component.html',
  styleUrls: ['./add-temporary-worker-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTemporaryWorkerDialogComponent implements OnInit {
  temporaryWorker: CompleteEmployee;
  departments: Department[];
  providers: Provider[];

  constructor(
    public matDialogRef: MatDialogRef<AddTemporaryWorkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _activityService: ActivityTemporaryWorkerService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.initTemporaryWorkerToUpdate(data.temporaryWorker);
    } else {
      this.temporaryWorker = new CompleteEmployee();
    }
  }

  ngOnInit(): void {
    this._activityService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments;
    });
    this._activityService.onProvidersChanged.subscribe((sites) => {
      this.providers = sites;
    });
  }

  addActivity(): void {
    this.temporaryWorker.provider = Object.keys(this.temporaryWorker.provider).length === 0 ?
      null :
      this.temporaryWorker.provider;
    this._loaderService.start();
    this._activityService.addTemporaryWorker(this.temporaryWorker).subscribe((response) => {
      this._loaderService.stop();
      if (response) {
        this.matDialogRef.close({ success: true });
        this._notificationService.showSuccess('Intérimaire crée avec succés');
      }
    }, (err) => {
      console.log(err);
      this._loaderService.stop();
      this._notificationService.showStandarError();
    });
  }

  updateActivity(): void {
    this._loaderService.start();
    this._activityService.updateTemporaryWorker(this.temporaryWorker)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          this.matDialogRef.close({ success: true });
          this._notificationService.showSuccess('Intérimaire modifiée avec succés');
        }
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
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

  initTemporaryWorkerToUpdate(temporaryWorker: CompleteEmployee): void {
    this.temporaryWorker = temporaryWorker;
    this.temporaryWorker.birthdate = MainTools.convertStringtoDate(this.temporaryWorker.birthdate);
    this.temporaryWorker.provider = this.temporaryWorker.provider ?
      this.temporaryWorker.provider :
      new Provider();
  }

  compareFn(department1: Department, department2: Department): any {
    return department1 && department2 ?
      department1.id === department2.id :
      department1 === department2;
  }

}



