import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Department } from 'app/common/models/department';
import { ActivityService } from '../activity.service';
import { Employee } from 'app/main/ticket/models/employee';
import { NgForm } from '@angular/forms';
import { ActivityParameters } from 'app/main/activity/models/activityParameters';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'activity-sidebar',
  templateUrl: './activity-sidebar.component.html',
  styleUrls: ['./activity-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivitySidebarComponent implements OnInit {
  departments: Department[];
  employees: Employee[];
  filtredEmployees: Employee[];
  selectedDepartment: Department;
  activityParameters: ActivityParameters;
  isTemporaryWorker: boolean;
  displaySimpleList: boolean;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _activityService: ActivityService,
    private _loaderService: NgxUiLoaderService
  ) {
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
    this._activityService.onIsTemporaryWorker.subscribe((isTemporaryWorker) => {
      this.isTemporaryWorker = isTemporaryWorker;
    });
    this._activityService.onHabilitationLoaded
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
  }

  getEmployeesForDepartment(): void {
    this._loaderService.start();
    this._activityService.getEmployeesForDepartment(this.selectedDepartment)
      .subscribe((employees) => {
        this.employees = employees;
        this.filtredEmployees = employees;
        this.activityParameters.employees = [];
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  getActivities(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this.activityParameters.activitiesFilter = '';
      this._activityService.onActivityParametersChanged.next(this.activityParameters);
      this._activityService.getActivitiesPerEmployee(this.activityParameters)
        .subscribe((activitiesPerEmployee) => {
          this._activityService.onActivitiesPerEmployeeChanged.next(activitiesPerEmployee);
          this._activityService.generateAllActivities(activitiesPerEmployee);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
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




