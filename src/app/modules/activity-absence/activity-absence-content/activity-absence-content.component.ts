import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityAbsenceService } from '../activity-absence.service';
import { AddActivityAbsenceDialogComponent } from '../dialogs/add-activity-absence-dialog/add-activity-absence-dialog.component';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivityAbsence } from 'app/modules/activity/models/activityAbsence';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'activity-absence-content',
  templateUrl: './activity-absence-content.component.html'
})
export class ActivityAbsenceContentComponent implements OnInit, OnDestroy {
  rows: ActivityAbsence[];
  temp: ActivityAbsence[];
  filterValue: string;
  hideRecoveryAbsencesValue: boolean;
  loadingIndicator: boolean;
  reorderable: boolean;
  smallScreen: boolean;
  private dialogRef: any;
  private unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['employee.fullName', 'absenceType.title' ,'startDate', 'endDate','actions' ]
  @ViewChild(MatSort , {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;
  constructor(
    public _matDialog: MatDialog,
    private _activityAbsenceService: ActivityAbsenceService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.unsubscribeAll = new Subject();
    this.loadingIndicator = true;
    this.reorderable = true;
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Nombre d'éléments par page";

    this._activityAbsenceService.onAbsencesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(absences => {
        this.resetFilter();
        this.temp = [...absences];
        this.rows = [...absences];

        this.dataSource = new MatTableDataSource(this.rows);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'employee.fullName': return item.employee.fullName;
            case 'absenceType.title': return item.absenceType.title;
            default: return item[property];
          }

         
        };
        this.dataSource.paginator = this.paginator;
        this.loadingIndicator = false;
      });
    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }
      });
    this._activityAbsenceService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  updateActivityAbsence(row: ActivityAbsence): void {
    const currentActivityAbsence = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(AddActivityAbsenceDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        activityAbsence: currentActivityAbsence
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }

  deleteActivityAbsence(currentActivityAbsence: ActivityAbsence): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression absence',
        message: 'Etes-vous sûr de vouloir supprimer cette absence ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
          this._activityAbsenceService.deleteActivityAbsence(currentActivityAbsence)
            .subscribe((res) => {
              const deletedActivityAbsenceIndex = this.rows.findIndex(x => x.id === currentActivityAbsence.id);
              this.rows.splice(deletedActivityAbsenceIndex, 1);
              this._activityAbsenceService.onAbsencesChanged.next(this.rows);
            }, (err) => {
              console.log(err);
            });
        }
      });
  }

  onFilterByName(event): void {
    this.filterValue = event.target.value.toLowerCase();
    this.filterAbsences();
  }

  onHideRecoveryAbsences(hideValue: boolean): void {
    this.hideRecoveryAbsencesValue = hideValue;
    this.filterAbsences();
  }

  filterAbsences(): void {
    let temp = this.temp.filter((absence) => {
      return absence.employee.fullName
        .toLowerCase()
        .indexOf(this.filterValue) !== -1 || !this.filterValue;
    });
    if (this.hideRecoveryAbsencesValue) {
      temp = temp.filter((absence) => {
        return absence.absenceType.id !== 6 && absence.absenceType.id !== 34;
      });
    }
    this.rows = temp;
    this.dataSource = new MatTableDataSource(this.rows);

  }

  resetFilter(): void {
    this.filterValue = null;
    this.hideRecoveryAbsencesValue = false;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

}


