import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdvanceSalaryService } from '../advance-salary.service';
import { Department } from 'app/main/webcms/web-messages/models/department';
import { AdvanceSalaryStatus } from 'app/main/advance-salary/models/advanceSalaryStatus';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FilterAdvanceSalary } from 'app/main/advance-salary/models/filterAdvanceSalary';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'advance-salary-sidebar',
  templateUrl: './advance-salary-sidebar.component.html',
  styleUrls: ['./advance-salary-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    private _advanceSalaryService: AdvanceSalaryService,
    private _loaderService: NgxUiLoaderService) {
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
    this._loaderService.start();
    this._advanceSalaryService.getAdvanceSalaries(this.filterParams)
      .subscribe((data) => {
        this._advanceSalaryService.onAdvanceSalariesChanged.next(data.advanceSalaries);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
