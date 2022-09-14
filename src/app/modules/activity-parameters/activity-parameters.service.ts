import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department } from 'app/common/models/department';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { DepartmentsSetter } from './models/departmentsSetter';
import { EmployeesWithDepartments } from './models/employeesWithDepartments';
import { Holiday } from './models/holiday';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityParametersService implements Resolve<any>{
  // activityparameters
  private GET_EMPLOYEES_URI = 'activityparameters/employees_departments';
  private UPDATE_EMPLOYEE_DEPARTMENTS_URI = 'activityparameters/employees_departments/update';
  private GET_DEPARTMENTS_URI = 'activityparameters/departments/get';
  // activityholidays
  private GET_ACTIVITY_HOLIDAYS_URI = 'activityparameters/activityholidays';
  private ADD_ACTIVITY_HOLIDAY_URI = 'activityparameters/activityholiday/add';
  private UPDATE_ACTIVITY_HOLIDAY_URI = 'activityparameters/activityholiday/update';
  private DELETE_ACTIVITY_HOLIDAY_URI = 'activityparameters/activityholiday/delete';

  private EXCLUDE_FROM_OVERTIME_COMPUTING_URI = 'activityparameters/employee/exclude_from_overtime_computing';

  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onEmployeesWithDepartmentsChanged: BehaviorSubject<EmployeesWithDepartments>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.activityparameters;

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService,
    private appService: AppService,
    private router: Router) {
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onEmployeesWithDepartmentsChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    console.log('### resolver ActivityParametersService');
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve(null);
              } else {
                this.initData().then(() => {
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

  initData(): Promise<any> {
    return Promise.all([
      this.getEmployeesWithDepartments(),
      this.getDepartments()
    ]);
  }

  getEmployeesWithDepartments(): Promise<EmployeesWithDepartments> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEES_URI}`;
      this._httpClient.get<EmployeesWithDepartments>(url)
        .subscribe((employees) => {
          this.onEmployeesWithDepartmentsChanged.next(employees);
          resolve(employees);
        }, reject);
    });
  }

  getDepartments(): Promise<Department[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_DEPARTMENTS_URI}`;
      this._httpClient.get<Department[]>(url)
        .subscribe((departments) => {
          this.onDepartmentsChanged.next(departments);
          resolve(departments);
        }, reject);
    });
  }

  updateEmployeeDepartments(departmentsSetter: DepartmentsSetter): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_EMPLOYEE_DEPARTMENTS_URI}`;
    return this._httpClient.post<any>(url, departmentsSetter);
  }

  getActivityHolidays(): Observable<any> {
    const url = `${BASE_URL}${this.GET_ACTIVITY_HOLIDAYS_URI}`;
    return this._httpClient.get<any>(url);
  }

  addActivityHoliday(activityHoliday: Holiday): Observable<Holiday> {
    const url = `${BASE_URL}${this.ADD_ACTIVITY_HOLIDAY_URI}`;
    return this._httpClient.post<Holiday>(url, activityHoliday);
  }

  updateActivityHoliday(activityHoliday: Holiday): Observable<Holiday> {
    const url = `${BASE_URL}${this.UPDATE_ACTIVITY_HOLIDAY_URI}`;
    return this._httpClient.post<Holiday>(url, activityHoliday);
  }

  deleteActivityHoliday(activityHolidayId: number): Observable<Holiday> {
    const url = `${BASE_URL}${this.DELETE_ACTIVITY_HOLIDAY_URI}?holidayId=${activityHolidayId}`;
    return this._httpClient.get<Holiday>(url);
  }

  excludeEpmloyeeFromOvertimeComputing(employee: any): Observable<any> {
    const url = `${BASE_URL}${this.EXCLUDE_FROM_OVERTIME_COMPUTING_URI}`;
    return this._httpClient.post<any>(url, employee);
  }

}

