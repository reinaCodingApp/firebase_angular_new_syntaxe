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
import { CompleteEmployee } from 'app/main/activity/models/completeEmployee';
import { ActivityPerEmployee } from 'app/main/activity/models/activityPerEmployee';
import { Provider } from 'app/main/activity/models/provider';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { AbsenceType } from 'app/main/activity/models/absenceType';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';
import { Month } from '../foreign-mission/models/month';
import { RequestParameter } from '../activity-statistics/models/requestParameter';

@Injectable({
  providedIn: 'root'
})
export class ActivityTemporaryWorkerService implements Resolve<any>{
  private GET_ACTIVITY_VIEWMODEL_URI = 'activityTemporaryWorker/index';
  private GET_EMPLOYEES_URI = 'activityTemporaryWorker/employees';

  // Activities
  private GET_ACTIVITIES_URI = 'activityTemporaryWorker/activities';
  private ADD_ACTIVITY_URI = 'activityTemporaryWorker/add';
  private UPDATE_ACTIVITY_URI = 'activityTemporaryWorker/hours/update';
  private DELETE_ACTIVITY_URI = 'activityTemporaryWorker/delete';
  private UPDATE_BONUS_ACTIVITY_URI = 'activityTemporaryWorker/bonus/update';
  private UPDATE_BREAKS_ACTIVITY_URI = 'activityTemporaryWorker/breaks/update';

  // Temporary Workers
  private GET_TEMPORARY_WORKERS_URI = 'activityTemporaryWorker/temporary_workers';
  private ADD_TEMPORARY_WORKER_URI = 'activityTemporaryWorker/temporary_workers/add';
  private UPDATE_TEMPORARY_WORKER_URI = 'activityTemporaryWorker/temporary_workers/update';
  private DELETE_TEMPORARY_WORKER_URI = 'activityTemporaryWorker/temporary_workers/delete';
  private UPDATE_TEMPORARY_WORKER_STATE_URI = 'activityTemporaryWorker/temporary_workers/state/update';
  private ADD_FOREIGN_MISSION_TEMPORARY_WORKER_URI = 'activityTemporaryWorker/temporary_workers/foreign_mission/add';
  private GENERATE_TEMPORARY_WORKERS_STATISTICS_URI = 'activityTemporaryWorker/temporary_workers/generate_stats';

  onActivityParametersChanged: BehaviorSubject<ActivityParameters>;
  onActivitiesPerEmployeeChanged: BehaviorSubject<ActivityPerEmployee[]>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onAllEmployeesChanged: BehaviorSubject<CompleteEmployee[]>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onExecutiveEmployeesChanged: BehaviorSubject<ExecutiveEmployee[]>;
  onYearsChanged: BehaviorSubject<number[]>;
  onBonusCategoriesChanged: BehaviorSubject<BonusCategory[]>;
  onProvidersChanged: BehaviorSubject<Provider[]>;
  onAbsenceTypesChanged: BehaviorSubject<AbsenceType[]>;
  onPossibleYearsChanged: BehaviorSubject<number[]>;
  onMonthsChanged: BehaviorSubject<Month[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private readonly moduleIdentifier = ModuleIdentifiers.interimactivity;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onActivityParametersChanged = new BehaviorSubject(new ActivityParameters());
    this.onActivitiesPerEmployeeChanged = new BehaviorSubject([]);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onAllEmployeesChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onExecutiveEmployeesChanged = new BehaviorSubject([]);
    this.onYearsChanged = new BehaviorSubject([]);
    this.onBonusCategoriesChanged = new BehaviorSubject([]);
    this.onProvidersChanged = new BehaviorSubject([]);
    this.onAbsenceTypesChanged = new BehaviorSubject([]);
    this.onPossibleYearsChanged = new BehaviorSubject([]);
    this.onMonthsChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
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
        } else {
          this.router.navigate(['login']);
          resolve();
        }
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
          this.initActivityParams(activityManageViewModel.defaultStartDate, activityManageViewModel.defaultEndDate);
          this.onActivitiesPerEmployeeChanged.next([]);
          this.onProvidersChanged.next(activityManageViewModel.providers);
          this.onAbsenceTypesChanged.next(activityManageViewModel.absenceTypes);
          this.onPossibleYearsChanged.next(activityManageViewModel.possibleYears);
          this.onMonthsChanged.next(activityManageViewModel.months);
          resolve(activityManageViewModel);
        }, reject);
    });
  }

  getEmployeesForDepartment(department: Department): Observable<Employee[]> {
    const url = `${BASE_URL}${this.GET_EMPLOYEES_URI}`;
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

  updateBreaksActivity(activity: Activity): Observable<Activity> {
    const url = `${BASE_URL}${this.UPDATE_BREAKS_ACTIVITY_URI}`;
    return this._httpClient.post<Activity | any>(url, activity);
  }

  initActivityParams(startDate: string, endDate: string): void {
    const activityParams: ActivityParameters = {
      startDate: startDate,
      endDate: endDate,
      employees: [],
      isTemporaryWorker: true,
      activitiesFilter: ''
    };
    this.onActivityParametersChanged.next(activityParams);
  }

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

  generateTemporaryWorkersStats(requestParameter: RequestParameter): any {
    const url = `${BASE_URL}${this.GENERATE_TEMPORARY_WORKERS_STATISTICS_URI}`;
    return this._httpClient.post<any>(url, requestParameter, { responseType: 'blob' as 'json' });
  }

}


