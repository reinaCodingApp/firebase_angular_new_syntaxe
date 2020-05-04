import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { TonnageMainViewModel } from 'app/main/tonnage/models/tonnageMainViewModel';
import { Site } from 'app/common/models/site';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { TonnageFilterViewModel } from 'app/main/tonnage/models/tonnageFilterViewModel';
import { TonnageDetail } from 'app/main/tonnage/models/tonnageDetail';
import { TonnageItemType } from 'app/main/tonnage/models/tonnageItemType';
import { TotalTonnageByType } from 'app/main/tonnage/models/totalTonnageByType';
import { Client } from 'app/main/tonnage/models/client';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RequestParameter } from 'app/main/tonnage/models/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TonnageService implements Resolve<any>
{
  private GET_TONNAGE_MAIN_VIEWMODEL_URI = 'tonnage/index';
  private GET_PARTNERS_URI = 'tonnage/partners';
  private GET_TONNAGES_URI = 'tonnage/filter';
  private GET_TONNAGE_DETAILS_URI = 'tonnage/details';
  private ADD_TONNAGE_URI = 'tonnage/add';
  private UPDATE_TONNAGE_URI = 'tonnage/update';
  private DELETE_TONNAGE_URI = 'tonnage/delete';

  private UPDATE_TONNAGE_DETAILS_URI = 'tonnage/detail/update';
  private ADD_TONNAGE_DETAILS_URI = 'tonnage/detail/add';
  private ADD_TONNAGE_DETAILS_BY_TOTAL_WEIGHT_URI = 'tonnage/detail/add/total_weight';
  private ADD_TONNAGE_GIBLET_DETAILS_URI = 'tonnage/gilbet/add';
  private DELETE_TONNAGE_DETAILS_URI = 'tonnage/detail/delete';
  private GENERATE_STATS_FOR_SITE = 'tonnage/statistics';
  private VALDATE_TONNAGE = 'tonnage/validate';
  private OPEN_TONNAGE = 'tonnage/open';

  onPartnersChanged: BehaviorSubject<Client[]>;
  onCurrentTonnageChanged: BehaviorSubject<Tonnage>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onPossiblePercentage: BehaviorSubject<number[]>;
  onTonnageFilterViewModelChanged: BehaviorSubject<TonnageFilterViewModel>;
  onTonnagesChanged: BehaviorSubject<Tonnage[]>;
  onTonnageItemTypesChanged: BehaviorSubject<TonnageItemType[]>;
  onTonnageGibletsChanged: BehaviorSubject<TonnageItemType[]>;
  onTotalBySelectedPeriodChanged: BehaviorSubject<TotalTonnageByType[]>;
  onTotalBySelectedPartnerChanged: BehaviorSubject<TotalTonnageByType[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.tonnage;

  constructor(
    private _httpClient: HttpClient,
    private _loaderService: NgxUiLoaderService,
    private appService: AppService,
    private router: Router
  ) {
    this.onPartnersChanged = new BehaviorSubject([]);
    this.onCurrentTonnageChanged = new BehaviorSubject(null);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onPossiblePercentage = new BehaviorSubject([]);
    this.onTonnageFilterViewModelChanged = new BehaviorSubject(null);
    this.onTonnagesChanged = new BehaviorSubject([]);
    this.onTonnageItemTypesChanged = new BehaviorSubject([]);
    this.onTonnageGibletsChanged = new BehaviorSubject([]);
    this.onTotalBySelectedPeriodChanged = new BehaviorSubject([]);
    this.onTotalBySelectedPartnerChanged = new BehaviorSubject([]);
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
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  initData(): Promise<any> {
    return Promise.all([
      this.getTonnageMainViewModel(),
      this.getPartners()
    ]);
  }

  getTonnageMainViewModel(): Promise<TonnageMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TONNAGE_MAIN_VIEWMODEL_URI}`;
      this._httpClient.get<TonnageMainViewModel>(url).subscribe((tonnageMainViewModel) => {
        this.onPossiblePercentage.next(tonnageMainViewModel.possiblePercentage);
        this.onSitesChanged.next(tonnageMainViewModel.sites);
        this.onTonnageFilterViewModelChanged.next(tonnageMainViewModel.tonnageFilterViewModel);
        this.onTonnageItemTypesChanged.next(tonnageMainViewModel.tonnageItemTypes);
        this.onTonnageGibletsChanged.next(tonnageMainViewModel.tonnageAbats);
        resolve();
      }, reject);
    });
  }

  getPartners(): Promise<Client[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_PARTNERS_URI}`;
      this._httpClient.get<Client[]>(url).subscribe((partners) => {
        this.onPartnersChanged.next(partners);
        resolve();
      }, reject);
    });
  }

  addTonnage(tonnage: Tonnage): Observable<Tonnage> {
    const url = `${BASE_URL}${this.ADD_TONNAGE_URI}`;
    return this._httpClient.post<Tonnage>(url, tonnage);
  }

  updateTonnage(tonnage: Tonnage): Observable<boolean> {
    const url = `${BASE_URL}${this.UPDATE_TONNAGE_URI}`;
    return this._httpClient.post<boolean>(url, tonnage);
  }

  deleteTonnage(tonnageId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.DELETE_TONNAGE_URI}?id=${tonnageId}`;
    return this._httpClient.get<boolean>(url);
  }

  getTonnages(tonnageFilterViewModel: TonnageFilterViewModel): Observable<TonnageMainViewModel> {
    const url = `${BASE_URL}${this.GET_TONNAGES_URI}`;
    return this._httpClient.post<TonnageMainViewModel>(url, tonnageFilterViewModel);
  }

  getTonnageDetails(tonnageId: number): Observable<TonnageMainViewModel> {
    const url = `${BASE_URL}${this.GET_TONNAGE_DETAILS_URI}?id=${tonnageId}`;
    return this._httpClient.get<TonnageMainViewModel>(url);
  }

  addTonnageDetail(tonnageDetails: TonnageDetail): Observable<boolean> {
    const url = `${BASE_URL}${this.ADD_TONNAGE_DETAILS_URI}`;
    return this._httpClient.post<boolean>(url, tonnageDetails);
  }

  addTonnageDetailByTotalWeightAndQuantity(tonnageDetails: TonnageDetail): Observable<boolean> {
    const url = `${BASE_URL}${this.ADD_TONNAGE_DETAILS_BY_TOTAL_WEIGHT_URI}`;
    return this._httpClient.post<boolean>(url, tonnageDetails);
  }

  addTonnageGibletDetail(tonnageGibletDetails: TonnageDetail): Observable<boolean> {
    const url = `${BASE_URL}${this.ADD_TONNAGE_GIBLET_DETAILS_URI}`;
    return this._httpClient.post<boolean>(url, tonnageGibletDetails);
  }

  updateTonnageDetail(tonnageDetails: TonnageDetail): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_TONNAGE_DETAILS_URI}`;
    return this._httpClient.post<any>(url, tonnageDetails);
  }

  deleteTonnageDetail(tonnageId: number): Observable<any> {
    const url = `${BASE_URL}${this.DELETE_TONNAGE_DETAILS_URI}?id=${tonnageId}`;
    return this._httpClient.get<any>(url);
  }

  generateStatsForSite(requestParameter: RequestParameter): any {
    const url = `${BASE_URL}${this.GENERATE_STATS_FOR_SITE}`;
    return this._httpClient.post<any>(url, requestParameter, { responseType: 'blob' as 'json' });
  }

  validateTonnage(tonnage: Tonnage): any {
    const url = `${BASE_URL}${this.VALDATE_TONNAGE}?tonnageId=${tonnage.id}`;
    return this._httpClient.get<any>(url);
  }

  openTonnage(tonnage: Tonnage): any {
    const url = `${BASE_URL}${this.OPEN_TONNAGE}?tonnageId=${tonnage.id}`;
    return this._httpClient.get<any>(url);
  }

  refreshData(): void {
    this.getTonnages(this.onTonnageFilterViewModelChanged.getValue())
      .subscribe((tonnageMainViewModel) => {
        this.onTonnagesChanged.next(tonnageMainViewModel.tonnages);
        this.onTotalBySelectedPeriodChanged.next(tonnageMainViewModel.totalBySelectedPeriod);
        this._loaderService.stop();
      });
  }
}
