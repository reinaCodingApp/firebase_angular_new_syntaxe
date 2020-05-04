import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { TraceabilitySheetViewModel } from 'app/main/traceability-sheet/models/traceabilitySheetViewModel';
import { Site } from 'app/common/models/site';
import { SheetRequestParameter } from 'app/main/traceability-sheet/models/sheetRequestParameter';
import { TraceabilitySheet } from 'app/main/traceability-sheet/models/traceabilitySheet';
import { TraceabilityColor } from 'app/main/traceability-sheet/models/traceabilityColor';
import { SheetItem } from 'app/main/traceability-sheet/models/sheetItem';
import { Employee } from 'app/common/models/employee';
import { Attachment } from 'app/common/models/attachment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TraceabilitySheetService implements Resolve<any>{
  private GET_TRACEABILITY_SHEET_VIEWMODEL_URI = 'traceabilitysheet/index';
  private GET_TRACEABILITY_SHEET_URI = 'traceabilitysheet/filter';
  private ADD_TRACEABILITY_SHEET_URI = 'traceabilitysheet/add';
  private ADD_TRACEABILITY_SHEET_ITEM_URI = 'traceabilitysheet/add/item';
  private UPDATE_TRACEABILITY_SHEET_ITEM_URI = 'traceabilitysheet/update/item';
  private DELETE_TRACEABILITY_SHEET_ITEM_URI = 'traceabilitysheet/delete/item';

  private UPDATE_TRACEABILITY_SHEET_RESPONSIBLE_URI = 'traceabilitysheet/update/responsible';
  private UPDATE_TRACEABILITY_SHEET_SACRIFICES_URI = 'traceabilitysheet/update/quantity';
  private UPDATE_TRACEABILITY_SHEET_MELCODE_URI = 'traceabilitysheet/update/mel';
  private UPDATE_TRACEABILITY_SHEET_DAYS_URI = 'traceabilitysheet/update/days';
  private UPDATE_TRACEABILITY_SHEET_TAMPONCODE_URI = 'traceabilitysheet/update/code';

  private ADD_TEAM_MEMBER_URI = 'traceabilitysheet/add/member';
  private DELETE_TEAM_MEMBER_URI = 'traceabilitysheet/delete/member';

  private GET_ATTACHMENTS_URI = 'traceabilitysheet/attachments';
  private UPLOAD_ATTACHMENTS_URI = 'traceabilitysheet/attachment/upload';
  private DOWNLOAD_ATTACHMENT_URI = 'traceabilitysheet/attachment/download';
  private DELETE_ATTACHMENT_URI = 'traceabilitysheet/attachment/delete';

  onSitesChanged: BehaviorSubject<Site[]>;
  onYearsChanged: BehaviorSubject<number[]>;
  onWeeksChanged: BehaviorSubject<number[]>;
  onColorsChanged: BehaviorSubject<TraceabilityColor[]>;
  onCurrentTraceabilitySheet: BehaviorSubject<TraceabilitySheet>;
  onEmployeesChanged: BehaviorSubject<Employee[]>;
  onCurrentYearChanged: BehaviorSubject<number>;

  maxFileSize = 4096;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.traceabilitysheet;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.onSitesChanged = new BehaviorSubject([]);
    this.onYearsChanged = new BehaviorSubject([]);
    this.onWeeksChanged = new BehaviorSubject([]);
    this.onCurrentTraceabilitySheet = new BehaviorSubject(null);
    this.onColorsChanged = new BehaviorSubject([]);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onCurrentYearChanged = new BehaviorSubject(0);
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
                this.getTraceabilitySheetViewModel().then(() => {
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

  getTraceabilitySheetViewModel(): Promise<TraceabilitySheetViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TRACEABILITY_SHEET_VIEWMODEL_URI}`;
      this._httpClient.get<TraceabilitySheetViewModel>(url)
        .subscribe((traceabilitySheetViewModel) => {
          this.onSitesChanged.next(traceabilitySheetViewModel.sites);
          this.onYearsChanged.next(traceabilitySheetViewModel.years);
          this.onWeeksChanged.next(traceabilitySheetViewModel.weeks);
          this.onColorsChanged.next(traceabilitySheetViewModel.colors);
          this.onEmployeesChanged.next(traceabilitySheetViewModel.employees);
          resolve(traceabilitySheetViewModel);
        }, reject);
    });
  }

  getTraceabilitySheet(sheetRequestParameter: SheetRequestParameter): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.GET_TRACEABILITY_SHEET_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, sheetRequestParameter);
  }

  addTraceabilitySheet(sheetRequestParameter: SheetRequestParameter): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.ADD_TRACEABILITY_SHEET_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, sheetRequestParameter);
  }

  addTraceabilitySheetItem(item: SheetItem): Observable<SheetItem> {
    const url = `${BASE_URL}${this.ADD_TRACEABILITY_SHEET_ITEM_URI}`;
    return this._httpClient.post<SheetItem>(url, item);
  }

  updateTraceabilitySheetItem(item: SheetItem): Observable<SheetItem> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_ITEM_URI}`;
    return this._httpClient.post<SheetItem>(url, item);
  }

  deleteTraceabilitySheetItem(item: SheetItem): Observable<SheetItem> {
    const url = `${BASE_URL}${this.DELETE_TRACEABILITY_SHEET_ITEM_URI}`;
    return this._httpClient.post<SheetItem>(url, item);
  }

  updateResponsible(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_RESPONSIBLE_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  updateQuantityOfSacrifices(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_SACRIFICES_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  updateMelCode(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_MELCODE_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  updateTamponCode(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_TAMPONCODE_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  updateSheetDays(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.UPDATE_TRACEABILITY_SHEET_DAYS_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  addTeamMember(sheetRequestParameter: SheetRequestParameter): Observable<Employee[]> {
    const url = `${BASE_URL}${this.ADD_TEAM_MEMBER_URI}`;
    return this._httpClient.post<Employee[]>(url, sheetRequestParameter);
  }

  deleteTeamMember(sheetRequestParameter: SheetRequestParameter): Observable<Employee[]> {
    const url = `${BASE_URL}${this.DELETE_TEAM_MEMBER_URI}`;
    return this._httpClient.post<Employee[]>(url, sheetRequestParameter);
  }

  getAttachments(traceabilitySheet: TraceabilitySheet): Observable<TraceabilitySheet> {
    const url = `${BASE_URL}${this.GET_ATTACHMENTS_URI}`;
    return this._httpClient.post<TraceabilitySheet>(url, traceabilitySheet);
  }

  uploadAttachments(sheetId: any, filesToUpload: any[]): Observable<any> {
    const url = `${BASE_URL}${this.UPLOAD_ATTACHMENTS_URI}`;
    const files = filesToUpload;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file_' + i, files[i]);
    }
    formData.append('sheetId', sheetId);
    return this._httpClient.post<any>(url, formData);

  }

  removeAttachment(sheetRequestParameter: SheetRequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.DELETE_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, sheetRequestParameter);
  }

  downloadAttachment(attachment: Attachment): Observable<any> {
    const url = `${BASE_URL}${this.DOWNLOAD_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, attachment, { responseType: 'blob' as 'json' });
  }

}

