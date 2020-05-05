import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Site } from 'app/common/models/site';
import { TraceabilityMainViewModel } from 'app/main/traceability/models/descending/traceabilityMainViewModel';
import { RequestParameter } from 'app/main/traceability/models/descending/requestParameter';
import { TraceabilityPlanification } from 'app/main/traceability/models/descending/traceabilityPlanification';
import { ReferenceCode } from 'app/main/traceability/models/descending/referenceCode';
import { Traceability } from 'app/main/traceability/models/descending/traceability';
import { TraceabilityMaterial } from 'app/main/traceability/models/traceabilityMaterial';
import { TraceabilityItem } from 'app/main/traceability/models/descending/traceabilityItem';
import { ExceptionalCode } from 'app/main/traceability/models/descending/exceptionalCode';
import * as moment from 'moment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { PaginationParameter } from './models/paginationParameter';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TraceabilityService implements Resolve<any>{
  private GET_TRACEABILITY_VIEWMODEL_URI = 'traceability/index';
  private GET_TRACEABILITY_PLANIFICATION_URI = 'traceability/filter_by_week';
  private GET_TRACEABILITY_PLANIFICATION_WEEKS_URI = 'traceability/filter_by_weeks';
  private ADD_UPDATE_TRACEABILITY_PLANIFICATION_URI = 'traceability/planification/update';
  private GET_AVAILABLE_CODES_URI = 'traceability/available_codes';
  private ADD_TRACEABILITY_URI = 'traceability/traceability/add';
  private ADD_TRACEABILITY_ALL_SITES_URI = 'traceability/traceability/add/all';
  private DELETE_TRACEABILITY_URI = 'traceability/traceability/delete';
  private UPDATE_COLOR_AND_COMMENT_URI = 'traceability/color/update';
  private ADD_TRACEABILITY_ITEM_URI = 'traceability/traceability_item/add';
  private UPDATE_TRACEABILITY_ITEM_URI = 'traceability/traceability_item/update';
  private DELETE_TRACEABILITY_ITEM_URI = 'traceability/traceability_item/delete';
  private UPDATE_TRACEABILITY_ITEM_MATERIAL_URI = 'traceability/traceability_item/material/update';
  private ADD_EXCEPTION_CODE_URI = 'traceability/exceptional_code/add';

  onSitesChanged: BehaviorSubject<Site[]>;
  onYearsChanged: BehaviorSubject<number[]>;
  onColorsChanged: BehaviorSubject<string[]>;
  onShapesChanged: BehaviorSubject<TraceabilityMaterial[]>;
  onTaceabilityPlanificationChanged: BehaviorSubject<TraceabilityPlanification>;
  onCodesChanged: BehaviorSubject<ReferenceCode[]>;
  onRequestParameterChanged: BehaviorSubject<RequestParameter>;
  onDefaultShapeChanged: BehaviorSubject<number>;
  onLastSearchInputChanged: BehaviorSubject<string>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.traceability;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.onSitesChanged = new BehaviorSubject([]);
    this.onYearsChanged = new BehaviorSubject([]);
    this.onTaceabilityPlanificationChanged = new BehaviorSubject(null);
    this.onColorsChanged = new BehaviorSubject([]);
    this.onShapesChanged = new BehaviorSubject([]);
    this.onCodesChanged = new BehaviorSubject([]);
    this.onRequestParameterChanged = new BehaviorSubject(new RequestParameter());
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onDefaultShapeChanged = new BehaviorSubject(0);
    this.onLastSearchInputChanged = new BehaviorSubject('');
  }

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                this.initData().then(() => {
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

  initData(): Promise<any> {
    return Promise.all([
      this.getTraceabilityMainViewModel(),
      this.getInitTraceabilityPlanification()
    ]);
  }

  getTraceabilityMainViewModel(): Promise<TraceabilityMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TRACEABILITY_VIEWMODEL_URI}`;
      this._httpClient.get<TraceabilityMainViewModel>(url)
        .subscribe((traceabilityViewModel) => {
          this.onSitesChanged.next(traceabilityViewModel.sites);
          this.onYearsChanged.next(traceabilityViewModel.years);
          this.onColorsChanged.next(traceabilityViewModel.colors);
          this.onShapesChanged.next(traceabilityViewModel.shapes);
          resolve(traceabilityViewModel);
        }, reject);
    });
  }

  getInitTraceabilityPlanification(): Promise<TraceabilityPlanification> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TRACEABILITY_PLANIFICATION_URI}`;
      const requestParameter: RequestParameter = {
        week: +moment().format('W'),
        year: +moment().format('YYYY')
      };
      return this._httpClient.post<TraceabilityPlanification>(url, requestParameter)
        .subscribe((traceabilityPlanification) => {
          this.onRequestParameterChanged.next(requestParameter);
          this.onTaceabilityPlanificationChanged.next(traceabilityPlanification);
          resolve(traceabilityPlanification);
        }, reject);
    });
  }

  getAvailablesCodes(paginationParameter: PaginationParameter): Observable<any[]> {
    const url = `${BASE_URL}${this.GET_AVAILABLE_CODES_URI}`;
    return this._httpClient.post<any[]>(url, paginationParameter);
  }

  getTraceabilityPlanification(requestParameter: RequestParameter): Observable<TraceabilityPlanification> {
    const url = `${BASE_URL}${this.GET_TRACEABILITY_PLANIFICATION_URI}`;
    return this._httpClient.post<TraceabilityPlanification>(url, requestParameter);
  }

  updateOrAddPlanification(requestParameter: RequestParameter): Observable<TraceabilityPlanification> {
    const url = `${BASE_URL}${this.ADD_UPDATE_TRACEABILITY_PLANIFICATION_URI}`;
    return this._httpClient.post<TraceabilityPlanification>(url, requestParameter);
  }

  addTraceability(traceability: Traceability): Observable<Traceability> {
    const url = `${BASE_URL}${this.ADD_TRACEABILITY_URI}`;
    return this._httpClient.post<Traceability>(url, traceability);
  }

  addTraceabilityForPreviousWeekSites(traceabilities: any[]): Observable<any> {
    const url = `${BASE_URL}${this.ADD_TRACEABILITY_ALL_SITES_URI}`;
    return this._httpClient.post<any>(url, traceabilities);
  }

  deleteTraceability(traceabilityId: number): Observable<Traceability> {
    const url = `${BASE_URL}${this.DELETE_TRACEABILITY_URI}`;
    return this._httpClient.post<Traceability>(url, traceabilityId);
  }

  updateColorAndComment(traceability: Traceability): Observable<Traceability> {
    const url = `${BASE_URL}${this.UPDATE_COLOR_AND_COMMENT_URI}`;
    return this._httpClient.post<Traceability>(url, traceability);
  }

  addExceptionCode(exceptionalCode: ExceptionalCode): Observable<TraceabilityItem> {
    const url = `${BASE_URL}${this.ADD_EXCEPTION_CODE_URI}`;
    return this._httpClient.post<TraceabilityItem>(url, exceptionalCode);
  }

  addTraceabilityItem(traceabilityItem: TraceabilityItem): Observable<TraceabilityItem> {
    const url = `${BASE_URL}${this.ADD_TRACEABILITY_ITEM_URI}`;
    return this._httpClient.post<TraceabilityItem>(url, traceabilityItem);
  }

  updateTraceabilityItem(traceabilityItem: TraceabilityItem): Observable<TraceabilityItem> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_ITEM_URI}`;
    return this._httpClient.post<TraceabilityItem>(url, traceabilityItem);
  }

  deleteTraceabilityItem(traceabilityItem: TraceabilityItem): Observable<TraceabilityItem> {
    const url = `${BASE_URL}${this.DELETE_TRACEABILITY_ITEM_URI}`;
    return this._httpClient.post<TraceabilityItem>(url, traceabilityItem);
  }

  updateItemMaterial(requestParameter: RequestParameter): Observable<TraceabilityItem> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_ITEM_MATERIAL_URI}`;
    return this._httpClient.post<TraceabilityItem>(url, requestParameter);
  }

  printWeeks(requestParameter: RequestParameter): Observable<TraceabilityPlanification[]> {
    const url = `${BASE_URL}${this.GET_TRACEABILITY_PLANIFICATION_WEEKS_URI}`;
    return this._httpClient.post<TraceabilityPlanification[]>(url, requestParameter);
  }

}


