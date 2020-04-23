import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { Employee } from 'app/common/models/employee';
import { TourSheetService } from '../tour-sheet.service';

@Component({
  selector: 'tour-sheet-sidebar',
  templateUrl: './tour-sheet-sidebar.component.html',
  styleUrls: ['./tour-sheet-sidebar.component.scss']
})

export class TourSheetSidebarComponent implements OnInit {
  employees: Employee[];
  filtredEmployees: Employee[];

  weeks: number[];
  years: number[];

  employeeId: number;
  week: number;
  year: number;

  constructor(
    private _tourSheetService: TourSheetService,
    private _loaderService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this._tourSheetService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
      this.filtredEmployees = employees;
    });
    this.initValues();
  }

  getActivitiesRoadMapForUserAndWeek(): void {
    if (this.employeeId > 0) {
      this._loaderService.start();
      this._tourSheetService.getActivitiesRoadMapForUserAndWeek(
        this.week, this.year, this.employeeId).subscribe((tourSheetActivityList) => {
          this._tourSheetService.onTourSheetActivityListChanged.next(tourSheetActivityList);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  initValues(): void {
    this.years = this._tourSheetService.years;
    this.weeks = this._tourSheetService.weeks;
    this.week = +moment(Date.now()).week();
    this.year = +moment(Date.now()).year();
  }

  print(): void {
    window.print();
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }

}

