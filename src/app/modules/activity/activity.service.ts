import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department } from 'app/common/models/department';
import { Employee } from 'app/common/models/employee';
import { Site } from 'app/common/models/site';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { Activity } from './models/activity';
import { ActivityManageViewModel } from './models/activityManageViewModel';
import { ActivityParameters } from './models/activityParameters';
import { ActivityPerEmployee } from './models/activityPerEmployee';
import { BonusCategory } from './models/bonusCategory';
import { CompleteEmployee } from './models/completeEmployee';
import { ExecutiveEmployee } from './models/executiveEmployee';
import { ReplacementBonusCategory } from './models/replacementBonusCategory';

@Injectable({
  providedIn: 'root'
})
export class ActivityService implements Resolve<any>{
  private GET_ACTIVITY_VIEWMODEL_URI = 'activity/index';
  private ADD_ACTIVITY_URI = 'activity/add';
  private UPDATE_ACTIVITY_URI = 'activity/hours/update';
  private DELETE_ACTIVITY_URI = 'activity/delete';
  private UPDATE_BONUS_ACTIVITY_URI = 'activity/bonus/update';
  private UPDATE_REPLACEMNT_BONUS_ACTIVITY_URI = 'activity/replacement_bonus/update';
  private UPDATE_BREAKS_ACTIVITY_URI = 'activity/breaks/update';
  private GET_EMPLOYEES_URI = 'activity/employees';
  private GET_ALL_EMPLOYEES_URI = 'activity/all_employees';
  private GET_ACTIVITIES_URI = 'activity/activities';
  private GET_EXECUTIVE_EMPLOYEE_COUNTERS_URI = 'activity/executive_employees/counters';
  private GET_EMPLOYEES_SITES_URI = 'activity/employees_sites';

  onDisplaySimpleList: BehaviorSubject<boolean>;
  onActivityParametersChanged: BehaviorSubject<ActivityParameters>;
  onActivitiesPerEmployeeChanged: BehaviorSubject<ActivityPerEmployee[]>;
  onAllActivitiesChanged: BehaviorSubject<Activity[]>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onAllEmployeesChanged: BehaviorSubject<CompleteEmployee[]>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onExecutiveEmployeesChanged: BehaviorSubject<ExecutiveEmployee[]>;
  onYearsChanged: BehaviorSubject<number[]>;
  onBonusCategoriesChanged: BehaviorSubject<BonusCategory[]>;
  onReplacementBonusCategoriesChanged: BehaviorSubject<ReplacementBonusCategory[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private readonly moduleIdentifier = ModuleIdentifiers.employeeactivity;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onDisplaySimpleList = new BehaviorSubject(false);
    this.onActivityParametersChanged = new BehaviorSubject(new ActivityParameters());
    this.onActivitiesPerEmployeeChanged = new BehaviorSubject([]);
    this.onAllActivitiesChanged = new BehaviorSubject([]);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onAllEmployeesChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onExecutiveEmployeesChanged = new BehaviorSubject([]);
    this.onYearsChanged = new BehaviorSubject([]);
    this.onBonusCategoriesChanged = new BehaviorSubject([]);
    this.onReplacementBonusCategoriesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve(null);
              } else {
                this.getActivityManageViewModel().then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  resolve(null);
                }, (err) => {
                  reject(err);
                });
              }
            }, (err) => {
              reject(err);
            });
      }, (err) => {
        reject(err);
      });
    });
  }

  getActivityManageViewModel(): Promise<ActivityManageViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_ACTIVITY_VIEWMODEL_URI}`;
      this._httpClient.get<ActivityManageViewModel>(url)
        .subscribe((activityManageViewModel) => {
          this.onDepartmentsChanged.next(activityManageViewModel.departments);
          this.onAllEmployeesChanged.next(activityManageViewModel.allEmployees);
          this.onSitesChanged.next(activityManageViewModel.sites);
          this.onYearsChanged.next(activityManageViewModel.years);
          this.onBonusCategoriesChanged.next(activityManageViewModel.bonusCategories);
          this.onReplacementBonusCategoriesChanged.next(activityManageViewModel.replacementBonusCategories);
          this.initActivityParams(activityManageViewModel.defaultStartDate, activityManageViewModel.defaultEndDate);
          this.onActivitiesPerEmployeeChanged.next([]);
          this.onAllActivitiesChanged.next([]);
          resolve(activityManageViewModel);
        }, reject);
    });
  }

  getEmployeesForDepartment(department: Department): Observable<Employee[]> {
    const url = `${BASE_URL}${this.GET_EMPLOYEES_URI}`;
    return this._httpClient.post<Employee[]>(url, department);
  }

  getAllEmployeesForDepartment(department: Department): Observable<Employee[]> {
    const url = `${BASE_URL}${this.GET_ALL_EMPLOYEES_URI}`;
    return this._httpClient.post<Employee[]>(url, department);
  }

  getActivitiesPerEmployee(activityParameters: ActivityParameters): Observable<ActivityPerEmployee[]> {
    const url = `${BASE_URL}${this.GET_ACTIVITIES_URI}`;
    return this._httpClient.post<ActivityPerEmployee[]>(url, activityParameters);
  }

  addAtivity(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.ADD_ACTIVITY_URI}`;
    return this._httpClient.post<Activity>(url, activity);
  }

  updateActivity(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.UPDATE_ACTIVITY_URI}`;
    return this._httpClient.post<Activity | any>(url, activity);
  }

  deleteActivity(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.DELETE_ACTIVITY_URI}`;
    return this._httpClient.post<Activity>(url, activity);
  }

  updateBonusCategory(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.UPDATE_BONUS_ACTIVITY_URI}`;
    return this._httpClient.post<Activity | any>(url, activity);
  }

  updateReplacementBonusCategory(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.UPDATE_REPLACEMNT_BONUS_ACTIVITY_URI}`;
    return this._httpClient.post<Activity | any>(url, activity);
  }

  updateBreaksActivity(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.UPDATE_BREAKS_ACTIVITY_URI}`;
    return this._httpClient.post<Activity | any>(url, activity);
  }

  getExecutiveEmployeeCounters(year: number): Observable<ExecutiveEmployee[]> {
    const url = `${BASE_URL}${this.GET_EXECUTIVE_EMPLOYEE_COUNTERS_URI}?year=${year}`;
    return this._httpClient.get<ExecutiveEmployee[]>(url);
  }

  initActivityParams(startDate: string, endDate: string): void {
    const activityParams: ActivityParameters = {
      startDate: startDate,
      endDate: endDate,
      employees: [],
      isTemporaryWorker: false,
      activitiesFilter: ''
    };
    this.onActivityParametersChanged.next(activityParams);
  }

  getEmployeesAndSites(): Observable<any> {
    const url = `${BASE_URL}${this.GET_EMPLOYEES_SITES_URI}`;
    return this._httpClient.get<any>(url);
  }

  generateAllActivities(activitiesPerEmployee: ActivityPerEmployee[]): void {
    const activities: Activity[] = [];
    activitiesPerEmployee.forEach(activityPerEmployee => {
      activityPerEmployee.activitiesPerWeek.forEach(activitiesPerWeek => {
        activitiesPerWeek.activities.forEach(activity => {
          activities.push(activity);
        });
      });
    });
    this.onAllActivitiesChanged.next(activities);
  }
}


