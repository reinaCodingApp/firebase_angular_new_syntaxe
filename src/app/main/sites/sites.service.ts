import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { Site } from 'app/common/models/site';
import { SitesMainViewModel } from 'app/main/sites/models/sitesMainViewModel';
import { SiteType } from 'app/main/sites/models/siteType';
import { FilterSiteType } from 'app/main/sites/models/filterSiteType';
import { SiteFilter } from 'app/main/sites/models/siteFilter';
import { CompleteSite } from 'app/main/sites/models/completeSite';
import { PrintAgreemntParams } from 'app/main/sites/models/printAgreemntParams';
import { Department } from 'app/common/models/department';
import { CompleteRestaurant } from 'app/main/sites/models/completeRestaurant';
import { PritSiteListsParams } from 'app/main/sites/models/pritSiteListsParams';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class SitesService implements Resolve<any>
{
  private GET_SITES_MAIN_VIEWMODEL_URI = 'sites/index';
  private GET_FILTERED_SITES_URI = 'sites/filter';
  private ADD_SITE_URI = 'sites/add';
  private UPDATE_SITE_URI = 'sites/update';
  private UPDATE_RESTAURANT_INFO_URI = 'sites/restaurant/update';
  private GET_SHORT_STATS_URI = 'sites/short_stats';
  private ENABLE_SITE_URI = 'sites/enable';
  private DISABLE_SITE_URI = 'sites/disable';
  private GET_SITE_DETAILS_URI = 'sites/details';
  private GENERATE_AGREEMENT_NUMBER_URI = 'sites/agreement';
  private SET_RESTAURANT_VOUCHER_URI = 'sites/set_restaurant_voucher';
  private SET_ACTIVITY_MEAL_BONUS_URI = 'sites/set_activity_meal_bonus';
  private SET_INCLUDEIN_TRACEABILITY_URI = 'sites/set_include_in_traceability';
  private PRINT_LISTS_URI = 'sites/print_lists';
  private PRINT_AGREEMENT_URI = 'sites/print_agreement';

  private API_KEY = 'AIzaSyBOvshnFxEPLKW9GmSiCiW1KPZcoH-HUbY';
  //api key généré le 10/10/2018, compte inforamtique@avs.fr

  onSitesChanged: BehaviorSubject<Site[]>;
  onSiteTypesChanged: BehaviorSubject<SiteType[]>;
  onFiltreListTypesChanged: BehaviorSubject<FilterSiteType[]>;
  onFiltredSitesChanged: BehaviorSubject<{ data: any[], count: number }>;
  onSiteFilterChanged: BehaviorSubject<SiteFilter>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.sites;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.onSitesChanged = new BehaviorSubject([]);
    this.onSiteTypesChanged = new BehaviorSubject([]);
    this.onFiltreListTypesChanged = new BehaviorSubject([]);
    this.onFiltredSitesChanged = new BehaviorSubject(null);
    this.onSiteFilterChanged = new BehaviorSubject(null);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
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
      this.getSitesMainViewModel(),
      this.getSites()
    ]);
  }

  getSitesMainViewModel(): Promise<SitesMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_SITES_MAIN_VIEWMODEL_URI}`;
      this._httpClient.get<SitesMainViewModel>(url).subscribe((sitesMainViewModel) => {
        this.onSitesChanged.next(sitesMainViewModel.sites);
        this.onSiteTypesChanged.next(sitesMainViewModel.siteTypes);
        this.onFiltreListTypesChanged.next(sitesMainViewModel.filtreListTypes);
        this.onDepartmentsChanged.next(sitesMainViewModel.departments);
        resolve();
      }, reject);
    });
  }

  getSites(): Promise<{ data: any[], count: number }> {
    return new Promise((resolve, reject) => {
      const siteFilter: SiteFilter = {
        startIndex: 0,
        filter: null,
        siteTypeId: 0,
        siteGroupId: 1,
        length: 10,
        showDisabled: false
      };
      this.onSiteFilterChanged.next(siteFilter);
      this.getFiltredSites(siteFilter).subscribe((result) => {
        this.onFiltredSitesChanged.next(result);
        resolve();
      }, reject);
    });
  }

  addSite(site: CompleteSite): Observable<number> {
    const url = `${BASE_URL}${this.ADD_SITE_URI}`;
    return this._httpClient.post<number>(url, site);
  }

  updateSite(site: CompleteSite): Observable<CompleteSite> {
    const url = `${BASE_URL}${this.UPDATE_SITE_URI}`;
    return this._httpClient.post<CompleteSite>(url, site);
  }

  getFiltredSites(siteFilter: SiteFilter): Observable<{ data: any[], count: number }> {
    const url = `${BASE_URL}${this.GET_FILTERED_SITES_URI}`;
    return this._httpClient.post<{ data: any[], count: number }>(url, siteFilter);
  }

  getShortStats(): Observable<any> {
    const url = `${BASE_URL}${this.GET_SHORT_STATS_URI}`;
    return this._httpClient.get<any>(url);
  }

  printAgreement(parameters: PrintAgreemntParams): Observable<any> {
    const url = `${BASE_URL}${this.PRINT_AGREEMENT_URI}`;
    return this._httpClient.post<any>(url, parameters, { responseType: 'blob' as 'json' });
  }

  printSitesLists(parameters: PritSiteListsParams): Observable<any> {
    const url = `${BASE_URL}${this.PRINT_LISTS_URI}`;
    return this._httpClient.post<any>(url, parameters, { responseType: 'blob' as 'json' });
  }

  enableSite(siteId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.ENABLE_SITE_URI}?id=${siteId}`;
    return this._httpClient.get<boolean>(url);
  }

  disableSite(siteId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.DISABLE_SITE_URI}?id=${siteId}`;
    return this._httpClient.get<boolean>(url);
  }

  getSiteDetails(siteId: number): Observable<any> {
    const url = `${BASE_URL}${this.GET_SITE_DETAILS_URI}?id=${siteId}`;
    return this._httpClient.get<any>(url);
  }

  getCoordinateFromAdress(addressParam: string): Observable<any> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + this.API_KEY + addressParam;
    return this._httpClient.get<any>(url);
  }

  generateAgreementNumber(zipCode: string): Observable<string> {
    const url = `${BASE_URL}${this.GENERATE_AGREEMENT_NUMBER_URI}?zipCode=${zipCode}`;
    return this._httpClient.get<string>(url);
  }

  setRestaurantVoucher(idSite: number, isEnable: boolean): Observable<boolean> {
    const url = `${BASE_URL}${this.SET_RESTAURANT_VOUCHER_URI}?idSite=${idSite}&isEnable=${isEnable}`;
    return this._httpClient.get<boolean>(url);
  }

  setActivityMealBonus(idSite: number, mealBagId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.SET_ACTIVITY_MEAL_BONUS_URI}?idSite=${idSite}&mealBagId=${mealBagId}`;
    return this._httpClient.get<boolean>(url);
  }

  setIncludedInTraceability(idSite: number, includedInTraceability: boolean): Observable<boolean> {
    const url = `${BASE_URL}${this.SET_INCLUDEIN_TRACEABILITY_URI}?idSite=${idSite}&includedInTraceability=${includedInTraceability}`;
    return this._httpClient.get<boolean>(url);
  }

  updateRestaurantInformation(site: CompleteRestaurant): Observable<CompleteRestaurant> {
    const url = `${BASE_URL}${this.UPDATE_RESTAURANT_INFO_URI}`;
    return this._httpClient.post<CompleteRestaurant>(url, site);
  }

}

