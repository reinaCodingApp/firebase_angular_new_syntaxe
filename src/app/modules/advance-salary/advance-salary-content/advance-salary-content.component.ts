import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceSalaryService } from '../advance-salary.service';
import { AddAdvanceSalaryDialogComponent } from '../dialogs/add-advance-salary-dialog/add-advance-salary-dialog.component';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { CustomConfirmDialogComponent as CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { Advance } from '../models/advance';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { AdvanceSalaryComponent } from '../advance-salary.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'advance-salary-content',
  templateUrl: './advance-salary-content.component.html'
})
export class AdvanceSalaryContentComponent implements OnInit, OnDestroy {
  advances: Advance[];
  rows: any[];
  displayedColumns: string[] = ['employee.fullName', 'requestAmount', 'requestAwarded', 'requestDate', 
  'advanceSalaryStatus.name', 'actions'];
  loadingIndicator: boolean;
  reorderable: boolean;
  dialogRef: any;
  smallScreen: boolean;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort , {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator:MatPaginator;

  constructor(
    public advanceSalaryComponent: AdvanceSalaryComponent,
    public _matDialog: MatDialog,
    private _advanceSalaryService: AdvanceSalaryService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.loadingIndicator = true;
    this.reorderable = true;
    this._unsubscribeAll = new Subject();

    
  }


  ngOnInit(): void {
    this._advanceSalaryService.onAdvanceSalariesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(advanceSalaries => {
        this.rows = [...advanceSalaries];
        console.log('###, rows',this.rows);
     
        

        this.dataSource = new MatTableDataSource(this.rows);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'employee.fullName': return item.employee.fullName;
            case 'advanceSalaryStatus.name': return item.advanceSalaryStatus.name;
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
    this._advanceSalaryService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  addAdvanceSalary(): void {
    this.dialogRef = this._matDialog.open(AddAdvanceSalaryDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }
  updateAdvanceSalary(row: any): void {
    this.dialogRef = this._matDialog.open(AddAdvanceSalaryDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: row
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
        }
      });
  }

  deleteAdvanceSalary(currentAdvanceSalary: any): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression acompte',
        message: 'Etes-vous sûr de vouloir de supprimer cet acompte ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        } else {
          this._advanceSalaryService.deleteAdvanceSalary(currentAdvanceSalary.id).subscribe(() => {
            const deletedAdvanceSalaryIndex = this.rows.findIndex(x => x.id === currentAdvanceSalary.id);
            this.rows.splice(deletedAdvanceSalaryIndex, 1);
            this._advanceSalaryService.onAdvanceSalariesChanged.next(this.rows);
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
