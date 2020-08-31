import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Advance } from 'app/main/advance-salary/models/advance';
import { AdvanceSalaryService } from '../advance-salary.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddAdvanceSalaryDialogComponent } from '../dialogs/add-advance-salary-dialog/add-advance-salary-dialog.component';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent as CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'advance-salary-content',
  templateUrl: './advance-salary-content.component.html',
  styleUrls: ['./advance-salary-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvanceSalaryContentComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  advances: Advance[];
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  dialogRef: any;
  smallScreen: boolean;
  private _unsubscribeAll: Subject<any>;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private _advanceSalaryService: AdvanceSalaryService,
    private _loaderService: NgxUiLoaderService,
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
        this.loadingIndicator = false;
        if (this.table) {
          this.table.offset = 0;
        }
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
          this._loaderService.start();
          this._advanceSalaryService.deleteAdvanceSalary(currentAdvanceSalary.id).subscribe(() => {
            this._loaderService.stop();
            const deletedAdvanceSalaryIndex = this.rows.findIndex(x => x.id === currentAdvanceSalary.id);
            this.rows.splice(deletedAdvanceSalaryIndex, 1);
            this._advanceSalaryService.onAdvanceSalariesChanged.next(this.rows);
          }, (err) => {
            console.log(err);
            this._loaderService.stop();
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
