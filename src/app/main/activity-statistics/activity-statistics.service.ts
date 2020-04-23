import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department } from 'app/common/models/department';
import { ActivitiesByRegionViewModel } from 'app/main/recap-activity/models/activitiesByRegionViewModel';
import { CommonService } from 'app/common/services/common.service';
import { StatisticsViewModel } from 'app/main/activity-statistics/models/statisticsViewModel';
import { Month } from 'app/main/foreign-mission/models/month';
import { StatViewModel } from 'app/main/activity-statistics/models/statViewModel';
import { RequestParameter } from 'app/main/activity-statistics/models/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityStatisticsService implements Resolve<any>{
  private GET_STATISTICS_VIEW_MODEL_URI = 'activity/statistics/parameters';
  private FILTER_STATISTICS_URI = 'activity/statistics/filter';
  private GENERATE_STATISTICS_URI = 'activity/statistics/month';

  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onPossibleYearsChanged: BehaviorSubject<number[]>;
  onMonthsChanged: BehaviorSubject<Month[]>;
  onStatsChanged: BehaviorSubject<StatViewModel>;
  onShowDataCentiemeFormat: BehaviorSubject<boolean>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.paymentStatistics;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onPossibleYearsChanged = new BehaviorSubject([]);
    this.onMonthsChanged = new BehaviorSubject([]);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onStatsChanged = new BehaviorSubject(null);
    this.onShowDataCentiemeFormat = new BehaviorSubject(false);
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
                this.getStatisticsViewModel().then(() => {
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

  getStatisticsViewModel(): Promise<StatisticsViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_STATISTICS_VIEW_MODEL_URI}`;
      this._httpClient.get<StatisticsViewModel>(url)
        .subscribe((statisticsViewModel) => {
          this.onDepartmentsChanged.next(statisticsViewModel.departements);
          this.onPossibleYearsChanged.next(statisticsViewModel.possibleYears);
          this.onMonthsChanged.next(statisticsViewModel.months);
          resolve(statisticsViewModel);
        }, reject);
    });
  }

  filterStatistics(employeeId: number, startDateStr: string, endDateStr: string): Observable<StatViewModel> {
    const url = `${BASE_URL}${this.FILTER_STATISTICS_URI}?employeeId=${employeeId}&startDateStr=${startDateStr}&endDateStr=${endDateStr}`;
    return this._httpClient.get<StatViewModel>(url);
  }

  generateStats(requestParameter: RequestParameter): any {
    const url = `${BASE_URL}${this.GENERATE_STATISTICS_URI}`;
    return this._httpClient.post<any>(url, requestParameter, { responseType: 'blob' as 'json' });
  }

}

