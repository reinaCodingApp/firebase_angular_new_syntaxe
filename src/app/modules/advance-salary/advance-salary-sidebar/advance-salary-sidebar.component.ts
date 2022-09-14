import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdvanceSalaryService } from '../advance-salary.service';
import { FilterAdvanceSalary } from '../models/filterAdvanceSalary';
import { Department } from 'app/common/models/department';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { AdvanceSalaryStatus } from '../models/advanceSalaryStatus';
@Component({
  selector: 'advance-salary-sidebar',
  templateUrl: './advance-salary-sidebar.component.html'
})
export class AdvancedSalarySidebarComponent implements OnInit, OnDestroy {
  filterParams: FilterAdvanceSalary;
  dialogRef: any;
  departments: Department[];
  advanceSalariesStatus: AdvanceSalaryStatus[];
  habilitation: Habilitation = new Habilitation(0);

  private _unsubscribeAll: Subject<any>;

  constructor(
    public _matDialog: MatDialog,
    private _advanceSalaryService: AdvanceSalaryService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._advanceSalaryService.onDepartmentsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(departments => {
        this.departments = departments;
      });
    this._advanceSalaryService.onAdvanceSalariesStatusChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(advanceSalariesStatus => {
        this.advanceSalariesStatus = advanceSalariesStatus;
      });
    this.filterParams = this._advanceSalaryService.filterParams;
    this._advanceSalaryService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  filterAdvanceSalaries(): void {
    this._advanceSalaryService.getAdvanceSalaries(this.filterParams)
      .subscribe((data) => {
        this._advanceSalaryService.onAdvanceSalariesChanged.next(data.advanceSalaries);
      }, (err) => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
