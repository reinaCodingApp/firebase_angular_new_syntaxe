import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HumanRessourcesViewModel } from 'app/main/advance-salary/models/humanRessourcesViewModel';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Advance } from 'app/main/advance-salary/models/advance';
import { FilterAdvanceSalary } from 'app/main/advance-salary/models/filterAdvanceSalary';
import * as moment from 'moment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AdvanceSalaryService implements Resolve<any>{
  GET_ADVANCE_SALARIES_VIEWMODEL_URI = 'advancesalary/index';
  GET_ADVANCE_SALARIES_URI = 'advancesalary/get';
  DELETE_ADVANCE_SALARY_URI = 'advancesalary/delete';
  ADD_ADVANCE_SALARY_URI = 'advancesalary/add';
  UPDATE_ADVANCE_SALARY_URI = 'advancesalary/update';

  onAdvanceSalariesChanged: BehaviorSubject<any[]>;
  onEmployeesChanged: BehaviorSubject<any>;
  onDepartmentsChanged: BehaviorSubject<any>;
  onAdvanceSalariesStatusChanged: BehaviorSubject<any>;

  filterParams: FilterAdvanceSalary;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.advancesalary;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.onAdvanceSalariesChanged = new BehaviorSubject([]);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onAdvanceSalariesStatusChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                this.getAdvanceSalariesViewModel().then(() => {
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

  getAdvanceSalariesViewModel(): Promise<HumanRessourcesViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_ADVANCE_SALARIES_VIEWMODEL_URI}`;
      this._httpClient.get<HumanRessourcesViewModel>(url)
        .subscribe((data) => {
          this.onEmployeesChanged.next(data.employees);
          this.onDepartmentsChanged.next(data.departments);
          this.onAdvanceSalariesStatusChanged.next(data.advanceSalariesStatus);
          this.filterParams = {
            startDate: moment(data.startDate),
            endDate: moment(data.endDate),
            statusId: -1,
            departmentId: -1
          };
          resolve(data);
        }, reject);
    });
  }

  getAdvanceSalaries(filterParams: FilterAdvanceSalary): Observable<HumanRessourcesViewModel> {
    const statusId = filterParams.statusId === -1 ? null : filterParams.statusId;
    const url = `${BASE_URL}${this.GET_ADVANCE_SALARIES_URI}?startDate=${filterParams.startDate.toISOString()}&endDate=${filterParams.endDate.toISOString()}&idStatut=${statusId}&idDepartment=${filterParams.departmentId}`;
    return this._httpClient.get<HumanRessourcesViewModel>(url);
  }

  deleteAdvanceSalary(id: number): Observable<boolean> {
    const url = `${BASE_URL}${this.DELETE_ADVANCE_SALARY_URI}`;
    return this._httpClient.post<boolean>(url, id);
  }

  addAdvanceSalary(advance: Advance): Observable<Advance> {
    const url = `${BASE_URL}${this.ADD_ADVANCE_SALARY_URI}`;
    return this._httpClient.post<Advance>(url, advance);
  }

  updateAdvanceSalary(advance: Advance): Observable<Advance> {
    const url = `${BASE_URL}${this.UPDATE_ADVANCE_SALARY_URI}`;
    return this._httpClient.post<Advance>(url, advance);
  }

}
