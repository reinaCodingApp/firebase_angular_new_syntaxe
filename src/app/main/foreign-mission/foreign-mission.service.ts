import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'app/common/models/employee';
import { Site } from 'app/common/models/site';
import { Month } from 'app/main/foreign-mission/models/month';
import { ForeignMissionMainViewModel } from 'app/main/foreign-mission/models/foreignMissionMainViewModel';
import { ForeignMissionActivity } from 'app/main/foreign-mission/models/foreignMissionActivity';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ForeignMissionService implements Resolve<any>{
  private GET_FOREIGN_MISSION_MAIN_VIEWMODEL_URI = 'foreignmission/index';
  private GET_FOREIGN_MISSIONS_URI = 'foreignmission/get';
  private ADD_FOREIGN_MISSION_URI = 'foreignmission/add';
  private UPDATE_FOREIGN_MISSION_URI = 'foreignmission/update';

  onForeignMissionsChanged: BehaviorSubject<any>;
  onEmployeesChanged: BehaviorSubject<Employee[]>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onPossibleYearsChanged: BehaviorSubject<number[]>;
  onMonthsChanged: BehaviorSubject<Month[]>;

  filterParams: {
    month: number;
    year: number;
  };

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.foreignmission;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onForeignMissionsChanged = new BehaviorSubject([]);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onPossibleYearsChanged = new BehaviorSubject([]);
    this.onMonthsChanged = new BehaviorSubject([]);
    this.filterParams = {
      month: 0,
      year: 0
    };
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
                this.getForeignMissionMainViewModel().then(() => {
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

  getForeignMissionMainViewModel(): Promise<ForeignMissionMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_FOREIGN_MISSION_MAIN_VIEWMODEL_URI}`;
      this._httpClient.get<ForeignMissionMainViewModel>(url)
        .subscribe((foreignMissionMainViewModel) => {
          this.onEmployeesChanged.next(foreignMissionMainViewModel.employees);
          this.onSitesChanged.next(foreignMissionMainViewModel.sites);
          this.onPossibleYearsChanged.next(foreignMissionMainViewModel.possibleYears);
          this.onMonthsChanged.next(foreignMissionMainViewModel.months);
          resolve(foreignMissionMainViewModel);
        }, reject);
    });
  }

  getMissions(month: number, year: number): Observable<ForeignMissionActivity[]> {
    this.filterParams.month = month;
    this.filterParams.year = year;
    const url = `${BASE_URL}${this.GET_FOREIGN_MISSIONS_URI}?month=${this.filterParams.month}&year=${this.filterParams.year}`;
    return this._httpClient.get<ForeignMissionActivity[]>(url);
  }

  addForeignMission(foreignMission: ForeignMissionActivity): Observable<ForeignMissionActivity> {
    const url = `${BASE_URL}${this.ADD_FOREIGN_MISSION_URI}`;
    return this._httpClient.post<ForeignMissionActivity>(url, foreignMission);
  }

  updateForeignMission(foreignMission: ForeignMissionActivity): Observable<ForeignMissionActivity> {
    const url = `${BASE_URL}${this.UPDATE_FOREIGN_MISSION_URI}`;
    return this._httpClient.post<ForeignMissionActivity>(url, foreignMission);
  }

  refreshData(): void {
    this.getMissions(this.filterParams.month, this.filterParams.year)
      .subscribe((foreignMissions) => {
        this.onForeignMissionsChanged.next(foreignMissions);
      });
  }

}
