import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivityService } from '../activity.service';
import { AddActivityDialogComponent } from '../dialogs/add-activity-dialog/add-activity-dialog.component';
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

@Component({
  selector: 'activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivityContentComponent implements OnInit, OnDestroy {
  activitiesPerEmployee: ActivityPerEmployee[] = [];
  activities: Activity[] = [];
  activityParameters: ActivityParameters;
  filterValue: string;
  isTemporaryWorker: boolean;
  displaySimpleList: boolean;
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
    'dayCounter',
    'title',
    'actions'
  ];
  displayedColumns2 = [
    'fullName',
    'day',
    'startTime',
    'totalBreakTimeString',
    'endTime',
    'totalWorkedTimeString',
    'site',
    'bonusString',
    'provider',
    'manuallyCreated',
    'dayCounter',
    'title',
    'actions'
  ];

  private dialogRef: any;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private _activityService: ActivityService,
    private _loaderService: NgxUiLoaderService,
    private appService: AppService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._activityService.onDisplaySimpleList
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((displaySimpleList) => {
        this.displaySimpleList = displaySimpleList;
      });
    this._activityService.onIsTemporaryWorker
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(isTemporaryWorker => {
        this.isTemporaryWorker = isTemporaryWorker;
      });
    this._activityService.onActivitiesPerEmployeeChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activitiesPerEmployee => {
        this.activitiesPerEmployee = [...activitiesPerEmployee];
      });
    this._activityService.onAllActivitiesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activities => {
        this.activities = [...activities];
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
    this.dialogRef = this._matDialog.open(AddActivityDialogComponent, {
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
          this._activityService.generateAllActivities(activitiesPerEmployee);
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
    this._activityService.generateAllActivities(temp);
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
    this._activityService.generateAllActivities(temp);
  }

  sortActivities(sort: Sort): void {
    const data = this.activities.slice();
    this.activities = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fullName': return this.compare(a.employee.fullName, b.employee.fullName, isAsc);
        case 'day': return this.compare(a.dayLong, b.dayLong, isAsc);
        case 'startTime': return this.compare(a.startTimeLong, b.startTimeLong, isAsc);
        case 'totalBreakTime': return this.compare(a.totalBreakTimeMinutes, b.totalBreakTimeMinutes, isAsc);
        case 'endTime': return this.compare(a.endTimeLong, b.endTimeLong, isAsc);
        case 'totalWorkedTime': return this.compare(a.totalWorkedTimeMinutes, b.totalWorkedTimeMinutes, isAsc);
        case 'site': return this.compare(a.site.name, b.site.name, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._activityService.onActivitiesPerEmployeeChanged.next([]);
    this.appService.setConfigButtonParameters(false, null);
  }
}



