import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'environments/environment';
import { TimelineService } from './timeline/timeline.service';
import { AppService } from 'app/app.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';

@Injectable({
  providedIn: 'root'
})
export class HomeService implements Resolve<any>
{
  private GET_ACTIVITIES_URI = 'home/week_pointages';
  projects: any[];
  widgets: any;
  private moduleIdentifier = ModuleIdentifiers.timeline;

  onActivitiesChanged: BehaviorSubject<any>;
  constructor(
    private httpClient: HttpClient,
    private timelineService: TimelineService,
    private appService: AppService,
    private router: Router
  ) {
    this.onActivitiesChanged = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              this.initData().then(() => {
                this.timelineService.onHabilitationLoaded.next(habilitation);
                resolve();
              }, (err) => {
                reject(err);
              });
            }, (err) => {
              reject(err);
            });
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  initData(): Promise<any> {
    return Promise.all([
      this.timelineService.getPublicMessages(),
      this.timelineService.getNews(),
      this.getActivities()
    ]);
  }

  getActivities(): void {
    this.httpClient.get<any[]>(`${BASE_URL}${this.GET_ACTIVITIES_URI}`).subscribe(data => {
      const activities = data.map(item => ({
        id: item.id, hours: item.hours, finished: item.finished, type: item.type,
        day: item.day, startTime: item.startTime, endTime: item.endTime
      }));
      this.onActivitiesChanged.next(activities);
    });
  }
}

