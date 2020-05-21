import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivityTemporaryWorkerService } from '../../activity-temporary-workers.service';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Department } from 'app/common/models/department';
import { AddTemporaryWorkerDialogComponent } from '../../dialogs/add-temporary-worker-dialog/add-temporary-worker-dialog.component';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'activity-temporary-workers',
  templateUrl: './activity-temporary-workers.component.html',
  styleUrls: ['./activity-temporary-workers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivityTemporaryWorkersComponent implements OnInit {
  temporaryWorkers: CompleteEmployee[];
  temp: CompleteEmployee[];
  departments: Department[];
  selectedDepartment: Department;
  displayedColumns = ['lastName', 'city', 'birthdate', 'provider', 'country', 'isEnable', 'edition'];

  private dialogRef: any;

  constructor(
    public _matDialog: MatDialog,
    private _activityService: ActivityTemporaryWorkerService,
    private _loaderService: NgxUiLoaderService,
    private _notificationsService: SharedNotificationService) { }

  ngOnInit(): void {
    this._activityService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments;
    });
    this.getTemporaryWorkers();
  }

  getTemporaryWorkers(): void {
    this._loaderService.start();
    this._activityService.getTemporaryWorkers(this.selectedDepartment)
      .subscribe(temporaryWorkers => {
        this._loaderService.stop();
        this.temp = temporaryWorkers;
        this.temporaryWorkers = temporaryWorkers;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationsService.showStandarError();
      });
  }

  addTemporaryWorker(): void {
    this.dialogRef = this._matDialog.open(AddTemporaryWorkerDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response){
          if (response.success) {
            this.getTemporaryWorkers();
          }
        }
      });
  }

  updateTemporaryWorker(currentTemporaryWorker: CompleteEmployee): void {
    const temporaryWorker = JSON.parse(JSON.stringify(currentTemporaryWorker));
    this.dialogRef = this._matDialog.open(AddTemporaryWorkerDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        temporaryWorker: temporaryWorker
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response){
          if (response.success) {
            this.getTemporaryWorkers();
          }
        }
      });
  }

  updateTemporaryWorkerState(currentTemporaryWorker: CompleteEmployee): void {
    currentTemporaryWorker.isEnable = !currentTemporaryWorker.isEnable;
    this._activityService.updateTemporaryWorkerState(currentTemporaryWorker)
      .subscribe(response => {
        this._loaderService.stop();
      }, (err) => {
        console.log(err);
        currentTemporaryWorker.isEnable = !currentTemporaryWorker.isEnable;
        this._loaderService.stop();
        this._notificationsService.showStandarError();
      });
  }

  deleteTemporaryWorker(currentTemporaryWorker: CompleteEmployee): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer intérimaire',
        message: 'Confirmez-vous la suppression de cet employée ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._activityService.deleteTemporaryWorker(currentTemporaryWorker)
            .subscribe((response) => {
              this._loaderService.stop();
              if (response) {
                const temporaryWorkerIndex = this.temporaryWorkers.findIndex(t => t.id === currentTemporaryWorker.id);
                this.temporaryWorkers.splice(temporaryWorkerIndex, 1);
                this.temporaryWorkers = [...this.temporaryWorkers];
              } else {
                this._notificationsService.showError('Suppression non autorisée!');
              }

            }, (err) => {
              console.log(err);
              this._loaderService.stop();
              this._notificationsService.showStandarError();
            });
        }
      });
  }

  filterTemporaryWorkers(event): void {
    const filterValue = event.target.value.toLowerCase();
    const temp = this.temp.filter((temporaryWorker) => {
      if (temporaryWorker.provider) {
        return (temporaryWorker.firstName
          .toLowerCase()
          .indexOf(filterValue) !== -1 || !filterValue) ||
          (temporaryWorker.lastName
            .toLowerCase()
            .indexOf(filterValue) !== -1 || !filterValue) ||
          (temporaryWorker.city
            .toLowerCase()
            .indexOf(filterValue) !== -1 || !filterValue) ||
          (temporaryWorker.provider.name
            .toLowerCase()
            .indexOf(filterValue) !== -1 || !filterValue);
      } else {
        return (temporaryWorker.firstName
          .toLowerCase()
          .indexOf(filterValue) !== -1 || !filterValue) ||
          (temporaryWorker.lastName
            .toLowerCase()
            .indexOf(filterValue) !== -1 || !filterValue) ||
          (temporaryWorker.city
            .toLowerCase()
            .indexOf(filterValue) !== -1 || !filterValue);
      }
    });
    this.temporaryWorkers = temp;
  }

}
