import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department } from 'app/common/models/department';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { MainTools } from 'app/common/tools/main-tools';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { AppService } from 'app/app.service';
import { Habilitation } from '../access-rights/models/habilitation';
import { ActivitiesByRegionViewModel } from './models/activitiesByRegionViewModel';

@Injectable({
  providedIn: 'root'
})
export class RecapActivityService implements Resolve<any>{
  private GET_DEPARTMENTS_URI = 'recapactivity/index';
  private GET_ACTIVITIES_REGION_DEPARTMENT_WEEK_URI = 'recapactivity/get';

  onActivitiesChanged: BehaviorSubject<ActivitiesByRegionViewModel>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;

  years: number[];
  weeks: number[];

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.recapactivity;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onActivitiesChanged = new BehaviorSubject(new ActivitiesByRegionViewModel());
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve(null);
              } else {
                this.getDepartments().then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  this.years = MainTools.getYears(new Date(2010, 0, 1), new Date(Date.now()));
                  this.weeks = EmbeddedDatabase.weeks;
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

  getActivitiesByRegionForDepartmentAndWeek(week: number, year: number, departmentId: number): Observable<ActivitiesByRegionViewModel> {
    const url = `${BASE_URL}${this.GET_ACTIVITIES_REGION_DEPARTMENT_WEEK_URI}?week=${week}&year=${year}&departmentId=${departmentId}`;
    return this._httpClient.get<ActivitiesByRegionViewModel>(url);
  }

}
