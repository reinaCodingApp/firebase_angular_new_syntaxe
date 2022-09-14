import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Department } from 'app/common/models/department';
import { ActivityService } from '../activity.service';
import { NgForm } from '@angular/forms';
import { Employee } from 'app/common/models/employee';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { Month } from 'app/modules/foreign-mission/models/month';
import { ActivityParameters } from '../models/activityParameters';

@Component({
  selector: 'activity-sidebar',
  templateUrl: './activity-sidebar.component.html'
})
export class ActivitySidebarComponent implements OnInit {
  departments: Department[];
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedDepartment: Department;
  activityParameters: ActivityParameters;
  displaySimpleList: boolean;
  months: Month[];
  years: number[];
  statsYear: number;
  statsMonth: number;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityService: ActivityService) {
    this.employees = [];
  }

  ngOnInit(): void {
    this._activityService.onDepartmentsChanged.subscribe((departments) => {
      this.departments = departments;
    });
    this._activityService.onActivityParametersChanged.subscribe((activityParameters) => {
      this.activityParameters = activityParameters;
    });
    this._activityService.onDisplaySimpleList.subscribe((displaySimpleList) => {
      this.displaySimpleList = displaySimpleList;
    });
    this._activityService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
      //only for tests; remove before the branch merge
      const params = {activitiesFilter: '',
                      employees: [{id: 1880},{id: 2942}],
                      startDate: '01/02/2022',
                      endDate:'30/04/2022',
                      isTemporaryWorker: false};
      this._activityService.getActivitiesPerEmployee(params as ActivityParameters)
        .subscribe((activitiesPerEmployee) => {
          this._activityService.onActivitiesPerEmployeeChanged.next(activitiesPerEmployee);
          this._activityService.generateAllActivities(activitiesPerEmployee);
        }, (err) => {
          console.log(err);
        });
  }

  getEmployeesForDepartment(): void {
    this._activityService.getEmployeesForDepartment(this.selectedDepartment)
      .subscribe((employees) => {
        this.employees = employees;
        this.filtredEmployees = employees;
        this.activityParameters.employees = [];
      }, (err) => {
        console.log(err);
      });
  }

  getActivities(form: NgForm): void {
    if (form.valid) {
      this.activityParameters.activitiesFilter = '';
      this._activityService.onActivityParametersChanged.next(this.activityParameters);
      this._activityService.getActivitiesPerEmployee(this.activityParameters)
        .subscribe((activitiesPerEmployee) => {
          this._activityService.onActivitiesPerEmployeeChanged.next(activitiesPerEmployee);
          this._activityService.generateAllActivities(activitiesPerEmployee);
        }, (err) => {
          console.log(err);
        });
    }
  }

  changeDisplayMode(mode): void {
    this.displaySimpleList = mode;
    this._activityService.onDisplaySimpleList.next(this.displaySimpleList);
  }

  searchEmployee(searchInput): void {
    if (!this.employees) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredEmployees = this.employees.filter(d => d.fullName.toLowerCase().indexOf(searchInput) > -1);
  }
}
