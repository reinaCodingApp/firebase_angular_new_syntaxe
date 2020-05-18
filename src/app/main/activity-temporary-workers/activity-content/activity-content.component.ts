import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivityTemporaryWorkerService } from '../activity-temporary-workers.service';
import { Activity } from 'app/main/activity/models/activity';
import { BonusActivityDialogComponent } from '../dialogs/bonus-activity-dialog/bonus-activity-dialog.component';
import { BreaksActivityDialogComponent } from '../dialogs/breaks-activity-dialog/breaks-activity-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { ActivityParameters } from 'app/main/activity/models/activityParameters';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityPerEmployee } from 'app/main/activity/models/activityPerEmployee';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { AppService } from 'app/app.service';
import { Sort } from '@angular/material/sort';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { UpdateActivityDialogComponent } from '../dialogs/update-activity-dialog/update-activity-dialog.component';

@Component({
  selector: 'activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivityContentComponent implements OnInit, OnDestroy {
  activitiesPerEmployee: ActivityPerEmployee[] = [];
  activityParameters: ActivityParameters;
  filterValue: string;
  displayedColumns = [
    'day',
    'startTime',
    'totalBreakTimeString',
    'endTime',
    'totalWorkedTimeString',
    'site',
    'bonusString',
    'provider',
    'manuallyCreated',
    'title',
    'actions'
  ];

  private dialogRef: any;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private _activityService: ActivityTemporaryWorkerService,
    private _loaderService: NgxUiLoaderService,
    private appService: AppService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._activityService.onActivitiesPerEmployeeChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activitiesPerEmployee => {
        this.activitiesPerEmployee = [...activitiesPerEmployee];
      });
    this._activityService.onActivityParametersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activityParameters => {
        this.activityParameters = activityParameters;
        this.filterValue = this.activityParameters.activitiesFilter;
      });
    this._activityService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
        if (this.habilitation.isSuperAdmin()) {
          this.appService.onShowConfigButtonChanged.next(true);
          this.appService.onConfigurationUrlChanged.next('/activityParameters');
        }
      });
  }

  updateActivity(row: Activity): void {
    const currentActivity = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(UpdateActivityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        activity: currentActivity
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success) {
            this.refreshAfterUpdate(response.data);
          }
        }
      });
  }

  deleteActivity(currentActivity: Activity): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression activité',
        message: 'Confirmez-vous la suppression de cette activité ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._activityService.deleteActivity(currentActivity)
            .subscribe(() => {
              this._loaderService.stop();
              this.refreshAfterDelete(currentActivity);
            }, (err) => {
              console.log(err);
              this._loaderService.stop();
            });
        }
      });
  }

  updateBonusActivity(row: Activity): void {
    const currentActivity = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(BonusActivityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        activity: currentActivity
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success) {
            this.refreshAfterUpdate(response.data);
          }
        }
      });
  }

  updateBreaksActivity(row: Activity): void {
    const currentActivity = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(BreaksActivityDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        activity: currentActivity
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success) {
            this.refreshAfterUpdate(response.data);
          }
        }
      });
  }

  onFilterBySite(): void {
    if (this.filterValue !== undefined && this.activitiesPerEmployee.length != 0) {
      this._loaderService.start();
      this.activityParameters.activitiesFilter = this.filterValue;
      this._activityService.getActivitiesPerEmployee(this.activityParameters)
        .subscribe((activitiesPerEmployee) => {
          this._loaderService.stop();
          this._activityService.onActivitiesPerEmployeeChanged.next(activitiesPerEmployee);
        }, (err) => {
          console.log(err);
          this._loaderService.stop();
        });
    }
  }

  refreshAfterUpdate(updatedAactivity: Activity): void {
    const temp = JSON.parse(JSON.stringify(this.activitiesPerEmployee));
    temp.forEach((data) => {
      data.activitiesPerWeek.forEach(activityPerWeek => {
        activityPerWeek.activities.forEach((activity, index) => {
          if (activity.id === updatedAactivity.id) {
            activityPerWeek.activities[index] = updatedAactivity;
          }
        });
      });
    });
    this._activityService.onActivitiesPerEmployeeChanged.next(temp);
  }

  refreshAfterDelete(currentActivity: Activity): void {
    const temp = JSON.parse(JSON.stringify(this.activitiesPerEmployee));
    temp.forEach((data) => {
      data.activitiesPerWeek.forEach(activityPerWeek => {
        activityPerWeek.activities.forEach((activity, index) => {
          if (activity.id === currentActivity.id) {
            activityPerWeek.activities[index].activityState = 0;
            activityPerWeek.activities[index].activityType = 0;
          }
        });
      });
    });
    this._activityService.onActivitiesPerEmployeeChanged.next(temp);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._activityService.onActivitiesPerEmployeeChanged.next([]);
    this.appService.setConfigButtonParameters(false, null);
  }
}



