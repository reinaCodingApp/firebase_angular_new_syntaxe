import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Department } from 'app/common/models/department';
import { NgForm } from '@angular/forms';
import { ActivityService } from 'app/main/activity/activity.service';
import { ActivityStatisticsService } from '../activity-statistics.service';
import { Month } from 'app/main/foreign-mission/models/month';
import * as moment from 'moment';
import { RequestParameter } from 'app/main/activity-statistics/models/requestParameter';
import { Employee } from 'app/common/models/employee';

@Component({
  selector: 'activity-statistics-sidebar',
  templateUrl: './activity-statistics-sidebar.component.html',
  styleUrls: ['./activity-statistics-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityStatisticsSidebarComponent implements OnInit {
  departments: Department[];
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedDepartment: Department;
  showDisableEmployee: boolean;

  months: Month[];
  years: number[];

  selectedEmployeeId: number;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  statsYear: number;
  statsMonth: number;

  showDataCentiemeFormat: boolean;

  constructor(
    private _activityStatisticsService: ActivityStatisticsService,
    private _activityService: ActivityService,
    private _loaderService: NgxUiLoaderService
  ) {
    this.employees = [];
    this.filtredEmployees = [];
  }

  ngOnInit(): void {
    this._activityStatisticsService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments;
    });
    this._activityStatisticsService.onPossibleYearsChanged.subscribe((years) => {
      this.years = years;
      this.initYears();
    });
    this._activityStatisticsService.onMonthsChanged.subscribe((months) => {
      this.months = months;
      this.initMonths();
    });
    this._activityStatisticsService.onShowDataCentiemeFormat
      .subscribe((showDataCentiemeFormat) => {
        this.showDataCentiemeFormat = showDataCentiemeFormat;
      });
  }

  getEmployeesForDepartment(): void {
    this._loaderService.start();
    if (this.showDisableEmployee) {
      this._activityService.getAllEmployeesForDepartment(this.selectedDepartment)
        .subscribe((employees) => {
          this.employees = employees;
          this.filtredEmployees = employees;
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    } else {
      this._activityService.getEmployeesForDepartment(this.selectedDepartment)
        .subscribe((employees) => {
          this.employees = employees;
          this.filtredEmployees = employees;
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  filterStatistics(form: NgForm): void {
    if (form.valid) {
      const startDate = new Date(this.startYear, this.startMonth - 1, 1);
      const endDate = new Date(this.endYear, this.endMonth - 1, 1);
      const startDateStr = moment(startDate).format('DD/MM/YYYY');
      const endDateStr = moment(endDate).format('DD/MM/YYYY');
      this._loaderService.start();
      this._activityStatisticsService.filterStatistics(this.selectedEmployeeId, startDateStr, endDateStr)
        .subscribe((stats) => {
          this._activityStatisticsService.onStatsChanged.next(stats);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  changeDataCentiemeFormat(): void {
    this._activityStatisticsService.onShowDataCentiemeFormat.next(!this.showDataCentiemeFormat);
  }

  generateStats(): void {
    this._loaderService.start();
    const requestParameter: RequestParameter = {
      year: this.statsYear,
      month: this.statsMonth
    };
    this._activityStatisticsService.generateStats(requestParameter)
      .subscribe((data) => {
        this._loaderService.stop();
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const startDate = `${requestParameter.month}/01/${requestParameter.year}`;
        const fileName = `${moment(startDate).format('MMMMYYYY')}.xlsx`;
        link.download = fileName;
        link.click();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  initYears(): void {
    const currentYear = +moment(Date.now()).year();
    this.startYear = this.endYear = this.statsYear = currentYear;
  }

  initMonths(): void {
    const currentMonth = +moment(Date.now()).month() + 1;
    this.startMonth = this.endMonth = this.statsMonth = currentMonth;
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}





