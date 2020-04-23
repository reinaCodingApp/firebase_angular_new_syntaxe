import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'app/common/models/employee';
import { TourSheetActivityList } from 'app/main/tour-sheet/models/tourSheetActivityList';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { MainTools } from 'app/common/tools/main-tools';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TourSheetService implements Resolve<any>{
  private GET_EMPLOYEES_URI = 'toursheet/index';
  private GET_ACTIVITIES_ROADMAP_FOR_USER_AND_WEEK_URI = 'toursheet/get';

  onEmployeesChanged: BehaviorSubject<Employee[]>;
  onTourSheetActivityListChanged: BehaviorSubject<TourSheetActivityList>;

  years: number[];
  weeks: number[];

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.toursheet;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onTourSheetActivityListChanged = new BehaviorSubject(null);
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
                this.getEmployees().then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  this.years = MainTools.getYears(new Date(2010, 0, 1), new Date(Date.now()));
                  this.weeks = EmbeddedDatabase.weeks;
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

  getEmployees(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEES_URI}`;
      this._httpClient.get<any>(url)
        .subscribe((employees) => {
          this.onEmployeesChanged.next(employees.employees);
          resolve(employees);
        }, reject);
    });
  }

  getActivitiesRoadMapForUserAndWeek(week: number, year: number, employeeId: number): Observable<TourSheetActivityList> {
    const url = `${BASE_URL}${this.GET_ACTIVITIES_ROADMAP_FOR_USER_AND_WEEK_URI}?week=${week}&year=${year}&employeeId=${employeeId}`;
    return this._httpClient.get<TourSheetActivityList>(url);
  }

}
