import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { Site } from 'app/common/models/site';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { TechnicalSheetMainViewModel } from 'app/main/technical-sheet/models/techincalSheetMainViewModel';
import { TechnicalSheetFilter } from 'app/main/technical-sheet/models/technicalSheetFilter';
import { AdditiveProvider } from 'app/main/technical-sheet/models/additiveProvider';
import { Attachment } from 'app/common/models/attachment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSheetService implements Resolve<any>
{
  private GET_TECHNICAL_SHEET_MAIN_VIEWMODEL_URI = 'technicalSheet/index';
  private GET_TECHNICAL_SHEETS_URI = 'technicalSheet/filter';
  private GET_TECHNICAL_SHEET_DETAILS_URI = 'technicalSheet/details';
  private ADD_TECHNICAL_SHEET_URI = 'technicalSheet/add';
  private UPDATE_TECHNICAL_SHEET_URI = 'technicalSheet/update';

  private GET_PROVIDERS_URI = 'technicalSheet/get/providers';
  private ADD_PROVIDER_URI = 'technicalSheet/add/provider';
  private UPDATE_PROVIDER_URI = 'technicalSheet/update/provider';
  private DELETE_PROVIDER_URI = 'technicalSheet/delete/provider';

  private UPLOAD_ATTACHMENT_URI = 'technicalSheet/attachment/upload';
  private DOWNLOAD_ATTACHMENT_URI = 'technicalSheet/attachment/download';
  private REMOVE_ATTACHMENT_URI = 'technicalSheet/attachment/remove';

  routePath: any;
  onCurrentTechnicalSheetChanged: BehaviorSubject<TechnicalSheet>;
  onTechnicalSheetsChanged: BehaviorSubject<TechnicalSheet[]>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onProvidersChanged: BehaviorSubject<AdditiveProvider[]>;
  onTechnicalSheetFilterChanged: BehaviorSubject<TechnicalSheetFilter>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.technicalsheet;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.onCurrentTechnicalSheetChanged = new BehaviorSubject(null);
    this.onTechnicalSheetsChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onProvidersChanged = new BehaviorSubject([]);
    this.onTechnicalSheetFilterChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routePath = route.routeConfig.path;
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                if (this.routePath.indexOf('technicalSheet-configuration') !== -1) {
                  this.getProviders().then(() => {
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                } else {
                  this.getTechnicalSheetMainViewModel().then(() => {
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
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getTechnicalSheetMainViewModel(): Promise<TechnicalSheetMainViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TECHNICAL_SHEET_MAIN_VIEWMODEL_URI}`;
      this._httpClient.get<TechnicalSheetMainViewModel>(url).subscribe((technicalSheetMainViewModel) => {
        const technicalSheetFilter: TechnicalSheetFilter = {
          site: technicalSheetMainViewModel.sites[0],
          startDate: technicalSheetMainViewModel.startDate,
          endDate: technicalSheetMainViewModel.endDate
        };
        this.onTechnicalSheetFilterChanged.next(technicalSheetFilter);
        this.onSitesChanged.next(technicalSheetMainViewModel.sites);
        this.onProvidersChanged.next(technicalSheetMainViewModel.providers);
        resolve();
      }, reject);
    });
  }

  addTechnicalSheet(technicalSheet: TechnicalSheet): Observable<TechnicalSheet> {
    const url = `${BASE_URL}${this.ADD_TECHNICAL_SHEET_URI}`;
    return this._httpClient.post<TechnicalSheet>(url, technicalSheet);
  }

  updateTechnicalSheet(technicalSheet: TechnicalSheet): Observable<TechnicalSheet> {
    const url = `${BASE_URL}${this.UPDATE_TECHNICAL_SHEET_URI}`;
    return this._httpClient.post<TechnicalSheet>(url, technicalSheet);
  }

  getTechnicalSheets(technicalSheetFilter: TechnicalSheetFilter): Observable<TechnicalSheet[]> {
    const url = `${BASE_URL}${this.GET_TECHNICAL_SHEETS_URI}`;
    return this._httpClient.post<TechnicalSheet[]>(url, technicalSheetFilter);
  }

  getTechnicalSheetDetails(technicalSheet: TechnicalSheet): Observable<TechnicalSheet> {
    const url = `${BASE_URL}${this.GET_TECHNICAL_SHEET_DETAILS_URI}`;
    return this._httpClient.post<TechnicalSheet>(url, technicalSheet);
  }

  getProviders(): Promise<AdditiveProvider[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_PROVIDERS_URI}`;
      this._httpClient.get<AdditiveProvider[]>(url)
        .subscribe((providers) => {
          this.onProvidersChanged.next(providers);
          resolve();
        }, reject);
    });
  }

  addProvider(provider: AdditiveProvider): Observable<number> {
    const url = `${BASE_URL}${this.ADD_PROVIDER_URI}`;
    return this._httpClient.post<number>(url, provider);
  }

  updateProvider(provider: AdditiveProvider): Observable<boolean> {
    const url = `${BASE_URL}${this.UPDATE_PROVIDER_URI}`;
    return this._httpClient.post<boolean>(url, provider);
  }

  deleteProvider(providerId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.DELETE_PROVIDER_URI}`;
    return this._httpClient.post<boolean>(url, providerId);
  }

  uploadAttachment(attachment: any, technicalSheetId: any): Observable<any> {
    const url = `${BASE_URL}${this.UPLOAD_ATTACHMENT_URI}`;
    const formData = new FormData();
    formData.append('file_', attachment);
    formData.append('sheetId', technicalSheetId);
    return this._httpClient.post<any>(url, formData);
  }

  downloadAttachment(attachment: Attachment): Observable<any> {
    const url = `${BASE_URL}${this.DOWNLOAD_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, attachment, { responseType: 'blob' as 'json' });
  }

  removeAttachment(technicalSheet: TechnicalSheet): Observable<TechnicalSheet> {
    const url = `${BASE_URL}${this.REMOVE_ATTACHMENT_URI}`;
    return this._httpClient.post<TechnicalSheet>(url, technicalSheet);
  }

}
