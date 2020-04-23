import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivityManageViewModel } from 'app/main/activity/models/activityManageViewModel';
import { Department } from 'app/common/models/department';
import { Employee } from 'app/common/models/employee';
import { ActivityParameters } from 'app/main/activity/models/activityParameters';
import { Site } from 'app/common/models/site';
import { Activity } from 'app/main/activity/models/activity';
import { ExecutiveEmployee } from 'app/main/activity/models/executiveEmployee';
import { BonusCategory } from 'app/main/activity/models/bonusCategory';
import { ReplacementBonusCategory } from 'app/main/activity/models/replacementBonusCategory';
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { ActivityPerEmployee } from 'app/main/activity/models/activityPerEmployee';
import { Provider } from 'app/main/activity/models/provider';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { AbsenceType } from 'app/main/activity/models/absenceType';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

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

  // Temporary Workers
  private GET_TEMPORARY_WORKERS_URI = 'activity/temporary_workers';
  private ADD_TEMPORARY_WORKER_URI = 'activity/temporary_workers/add';
  private UPDATE_TEMPORARY_WORKER_URI = 'activity/temporary_workers/update';
  private DELETE_TEMPORARY_WORKER_URI = 'activity/temporary_workers/delete';
  private UPDATE_TEMPORARY_WORKER_STATE_URI = 'activity/temporary_workers/state/update';
  private ADD_FOREIGN_MISSION_TEMPORARY_WORKER_URI = 'activity/temporary_workers/foreign_mission/add';

  onIsTemporaryWorker: BehaviorSubject<boolean>;
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
  // Temporary Workers
  onProvidersChanged: BehaviorSubject<Provider[]>;
  onAbsenceTypesChanged: BehaviorSubject<AbsenceType[]>;

  interim: boolean;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private readonly employeeactivity = ModuleIdentifiers.employeeactivity;
  private readonly interimactivity = ModuleIdentifiers.interimactivity;
  private moduleIdentifier: string;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onIsTemporaryWorker = new BehaviorSubject(false);
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

    this.onProvidersChanged = new BehaviorSubject([]);
    this.onAbsenceTypesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      if (route.url[1]) {
        const currentUrl = route.url[1].path;
        this.interim = currentUrl === 'interim';
        this.moduleIdentifier = this.interimactivity;
      } else {
        this.interim = false;
        this.moduleIdentifier = this.employeeactivity;
      }
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                this.getActivityManageViewModel().then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                }, (err) => {
                  reject(err);
                });
              }
            }, (err) => {
              reject(err);
            });
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getActivityManageViewModel(): Promise<ActivityManageViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_ACTIVITY_VIEWMODEL_URI}?interim=${this.interim}`;
      this._httpClient.get<ActivityManageViewModel>(url)
        .subscribe((activityManageViewModel) => {
          this.onIsTemporaryWorker.next(activityManageViewModel.isTemporaryWorker);
          this.onDepartmentsChanged.next(activityManageViewModel.departments);
          this.onAllEmployeesChanged.next(activityManageViewModel.allEmployees);
          this.onSitesChanged.next(activityManageViewModel.sites);
          this.onYearsChanged.next(activityManageViewModel.years);
          this.onBonusCategoriesChanged.next(activityManageViewModel.bonusCategories);
          this.onReplacementBonusCategoriesChanged.next(activityManageViewModel.replacementBonusCategories);
          this.initActivityParams(activityManageViewModel.defaultStartDate, activityManageViewModel.defaultEndDate, activityManageViewModel.isTemporaryWorker);
          this.onActivitiesPerEmployeeChanged.next([]);
          this.onAllActivitiesChanged.next([]);
          this.onProvidersChanged.next(activityManageViewModel.providers);
          this.onAbsenceTypesChanged.next(activityManageViewModel.absenceTypes);

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

  initActivityParams(startDate: string, endDate: string, isTemporaryWorker: boolean): void {
    const activityParams: ActivityParameters = {
      startDate: startDate,
      endDate: endDate,
      employees: [],
      isTemporaryWorker: isTemporaryWorker,
      activitiesFilter: ''
    };
    this.onActivityParametersChanged.next(activityParams);
  }

  getEmployeesAndSites(): Observable<any> {
    const url = `${BASE_URL}${this.GET_EMPLOYEES_SITES_URI}`;
    return this._httpClient.get<any>(url);
  }

  // Temporary Workers
  getTemporaryWorkers(department: Department): Observable<CompleteEmployee[]> {
    const url = `${BASE_URL}${this.GET_TEMPORARY_WORKERS_URI}`;
    return this._httpClient.post<CompleteEmployee[]>(url, department);
  }

  addTemporaryWorker(temporaryWorker: CompleteEmployee): Observable<CompleteEmployee> {
    const url = `${BASE_URL}${this.ADD_TEMPORARY_WORKER_URI}`;
    return this._httpClient.post<CompleteEmployee>(url, temporaryWorker);
  }

  updateTemporaryWorker(temporaryWorker: CompleteEmployee): Observable<CompleteEmployee> {
    const url = `${BASE_URL}${this.UPDATE_TEMPORARY_WORKER_URI}`;
    return this._httpClient.post<CompleteEmployee>(url, temporaryWorker);
  }

  deleteTemporaryWorker(temporaryWorker: CompleteEmployee): Observable<boolean> {
    const url = `${BASE_URL}${this.DELETE_TEMPORARY_WORKER_URI}`;
    return this._httpClient.post<boolean>(url, temporaryWorker);
  }

  addForeignMission(foreignMission: ForeignMissionActivity): Observable<ForeignMissionActivity> {
    const url = `${BASE_URL}${this.ADD_FOREIGN_MISSION_TEMPORARY_WORKER_URI}`;
    return this._httpClient.post<ForeignMissionActivity>(url, foreignMission);
  }

  updateTemporaryWorkerState(temporaryWorker: CompleteEmployee): Observable<CompleteEmployee> {
    const url = `${BASE_URL}${this.UPDATE_TEMPORARY_WORKER_STATE_URI}`;
    return this._httpClient.post<CompleteEmployee>(url, temporaryWorker);
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


