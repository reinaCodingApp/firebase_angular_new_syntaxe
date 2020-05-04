import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { MonthlyMeeting } from './models/monthlyMeeting';
import { MonthlyMeetingPresence } from './models/monthlyMeetingPresence';
import { Employee } from 'app/common/models/employee';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class MonthlyMeetingService implements Resolve<any>{
  private GET_MONTHLY_MEETINGS_URI = 'monthlymeetings/all';
  private GET_MONTHLY_MEETING_DETAILS_URI = 'monthlymeetings/details';
  private ADD_MONTHLY_MEETING_URI = 'monthlymeetings/add';
  private UPDATE_MONTHLY_MEETING_URI = 'monthlymeetings/update';
  private ADD_MONTHLY_MEETING_PRESENCE_URI = 'monthlymeetings/add_presence';
  private UPDATE_MONTHLY_MEETING_PRESENCE_URI = 'monthlymeetings/update_presence';

  onMonthlyMeetingsChanged: BehaviorSubject<MonthlyMeeting[]>;
  currentMonthlyMeetingChanged: BehaviorSubject<MonthlyMeeting>;
  onEmployeesChanged: BehaviorSubject<Employee[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.monthlyMeeting;

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService,
    private appService: AppService,
    private router: Router) {
    this.onMonthlyMeetingsChanged = new BehaviorSubject([]);
    this.currentMonthlyMeetingChanged = new BehaviorSubject(null);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                if (route.params.id) {
                  Promise.all([
                    this._commonService.getEmployees(),
                    this.getMonthlyMeetingDetails(route.params.id)
                  ]).then((response) => {
                    this.onEmployeesChanged.next(response[0]);
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                } else {
                  this.getMonthlyMeetings().then(() => {
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                }
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

  getMonthlyMeetings(): Promise<MonthlyMeeting[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_MONTHLY_MEETINGS_URI}`;
      this._httpClient.get<MonthlyMeeting[]>(url)
        .subscribe((monthlyMeetings) => {
          this.onMonthlyMeetingsChanged.next(monthlyMeetings);
          resolve(monthlyMeetings);
        }, reject);
    });
  }

  getMonthlyMeetingDetails(id: number): Promise<MonthlyMeeting> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_MONTHLY_MEETING_DETAILS_URI}?id=${id}`;
      this._httpClient.get<MonthlyMeeting>(url)
        .subscribe((monthlyMeeting) => {
          this.currentMonthlyMeetingChanged.next(monthlyMeeting);
          resolve(monthlyMeeting);
        }, reject);
    });
  }

  addMonthlyMeeting(monthlyMeeting: MonthlyMeeting): Observable<any> {
    const url = `${BASE_URL}${this.ADD_MONTHLY_MEETING_URI}`;
    return this._httpClient.post<any>(url, monthlyMeeting);
  }

  updateMonthlyMeeting(monthlyMeeting: MonthlyMeeting): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_MONTHLY_MEETING_URI}`;
    return this._httpClient.post<any>(url, monthlyMeeting);
  }

  addMonthlyMeetingPresence(monthlyMeetingPresence: MonthlyMeetingPresence): Observable<any> {
    const url = `${BASE_URL}${this.ADD_MONTHLY_MEETING_PRESENCE_URI}`;
    return this._httpClient.post<any>(url, monthlyMeetingPresence);
  }

  updateMonthlyMeetingPresence(monthlyMeetingPresence: MonthlyMeetingPresence): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_MONTHLY_MEETING_PRESENCE_URI}`;
    return this._httpClient.post<any>(url, monthlyMeetingPresence);
  }

}



