import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RecapActivityService } from '../recap-activity.service';
import * as moment from 'moment';
import { Department } from 'app/common/models/department';
import { ActivitiesByRegionViewModel } from '../models/activitiesByRegionViewModel';

@Component({
  selector: 'recap-activity-sidebar',
  templateUrl: './recap-activity-sidebar.component.html',
  styleUrls: ['./recap-activity-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecapActivitySidebarComponent implements OnInit {
  departments: Department[];
  weeks: number[];
  years: number[];

  departmentId: number;
  week: number;
  year: number;
  activities: ActivitiesByRegionViewModel;

  constructor(
    private _recapActivityService: RecapActivityService,
    private _loaderService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this._recapActivityService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments.filter(d => d.id > 0);
    });
    this.initValues();
  }

  getActivitiesByRegionForDepartmentAndWeek(): void {
    if (this.departmentId > 0) {
      this._loaderService.start();
      this._recapActivityService.getActivitiesByRegionForDepartmentAndWeek(
        this.week, this.year, this.departmentId).subscribe((activities) => {
          this._recapActivityService.onActivitiesChanged.next(activities);
          this.activities = activities;
          console.log('this.activities', this.activities);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  initValues(): void {
    this.years = this._recapActivityService.years;
    this.weeks = this._recapActivityService.weeks;
    this.week = +moment(Date.now()).week();
    this.year = +moment(Date.now()).year();
  }

  print(): void {
    if (!this.activities || !this.activities.activitiesByRegionRows || this.activities.activitiesByRegionRows.length === 0 ) {
      return;
    }
    window.print();
  }

}
