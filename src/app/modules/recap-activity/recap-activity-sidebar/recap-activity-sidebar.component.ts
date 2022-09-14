import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RecapActivityService } from '../recap-activity.service';
import * as moment from 'moment';
import { Department } from 'app/common/models/department';
import { ActivitiesByRegionViewModel } from '../models/activitiesByRegionViewModel';
import { RecapActivityComponent } from '../recap-activity.component';

@Component({
  selector: 'recap-activity-sidebar',
  templateUrl: './recap-activity-sidebar.component.html'
})
export class RecapActivitySidebarComponent implements OnInit {
  departments: Department[];
  weeks: number[];
  years: number[];

  departmentId: number;
  week: number;
  year: number;
  activities: ActivitiesByRegionViewModel;

  constructor(private _recapActivityService: RecapActivityService,
    public recapActivityComponent:
    RecapActivityComponent) { }

  ngOnInit(): void {
    this._recapActivityService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments.filter(d => d.id > 0);
    });
    this.initValues();
  }

  getActivitiesByRegionForDepartmentAndWeek(): void {
    if (this.departmentId > 0) {
      this._recapActivityService.getActivitiesByRegionForDepartmentAndWeek(
        this.week, this.year, this.departmentId).subscribe((activities) => {
          this._recapActivityService.onActivitiesChanged.next(activities);
          this.activities = activities;
          console.log('this.activities', this.activities);
        }, (err) => {
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

  async print() {
    if (!this.activities || !this.activities.activitiesByRegionRows || this.activities.activitiesByRegionRows.length === 0 ) {
      return;
    }
    await this.recapActivityComponent.drawer.close();
    window.print();
  }

}
