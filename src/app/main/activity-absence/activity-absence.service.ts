import { AppService } from 'app/app.service';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { AbsencesMainViewModel } from 'app/main/activity/models/absencesMainViewModel';
import { ActivityAbsence } from 'app/main/activity/models/activityAbsence';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';

@Injectable({
  providedIn: 'root'
})
export class ActivityAbsenceService implements Resolve<any>{
  private GET_ABSENCES_MAIN_VIEWMODEL_URI = 'activityabsence/index';
  private GET_ABSENCES_URI = 'activityabsence/filter';
  private ADD_ABSENCE_URI = 'activityabsence/add';
  private UPDATE_ABSENCE_URI = 'activityabsence/update';
  private DELETE_ABSENCE_URI = 'activityabsence/delete';

  onAbsencesChanged: BehaviorSubject<ActivityAbsence[]>;
  onAbsencesMainViewModel: BehaviorSubject<AbsencesMainViewModel>;

  activityAbsence: ActivityAbsence = null;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.absences;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onAbsencesChanged = new BehaviorSubject([]);
    this.onAbsencesMainViewModel = new BehaviorSubject(null);
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
                this.getAbsencesMainViewModel().then(() => {
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
  getAbsencesMainViewModel(): Promise<AbsencesMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_ABSENCES_MAIN_VIEWMODEL_URI}`;
      this._httpClient.get<AbsencesMainViewModel>(url)
        .subscribe((absencesMainViewModel) => {
          this.onAbsencesMainViewModel.next(absencesMainViewModel);
          resolve(absencesMainViewModel);
        }, reject);
    });
  }

  getAbsencesByDepartementForDate(absencesMainViewModel: AbsencesMainViewModel): Observable<ActivityAbsence[]> {
    this.onAbsencesMainViewModel.next(absencesMainViewModel);
    const url = `${BASE_URL}${this.GET_ABSENCES_URI}`;
    return this._httpClient.post<ActivityAbsence[]>(url, absencesMainViewModel);
  }

  addaAtivityAbsence(activityAbsence: ActivityAbsence): Observable<ActivityAbsence> {
    const url = `${BASE_URL}${this.ADD_ABSENCE_URI}`;
    return this._httpClient.post<ActivityAbsence>(url, activityAbsence);
  }

  updateActivityAbsence(activityAbsence: ActivityAbsence): Observable<ActivityAbsence> {
    const url = `${BASE_URL}${this.UPDATE_ABSENCE_URI}`;
    return this._httpClient.post<ActivityAbsence | any>(url, activityAbsence);
  }

  deleteActivityAbsence(activityAbsence: ActivityAbsence): Observable<ActivityAbsence> {
    const url = `${BASE_URL}${this.DELETE_ABSENCE_URI}`;
    return this._httpClient.post<ActivityAbsence>(url, activityAbsence);
  }

  refreshData(): void {
    this.getAbsencesByDepartementForDate(this.onAbsencesMainViewModel.getValue())
      .subscribe((activityAbsences) => {
        this.onAbsencesChanged.next(activityAbsences);
      });
  }

}

