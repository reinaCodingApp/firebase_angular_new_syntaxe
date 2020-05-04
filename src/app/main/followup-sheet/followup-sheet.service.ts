import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { FollowupSheetViewModel } from 'app/main/followup-sheet/models/followupSheetViewModel';
import { Section } from 'app/main/followup-sheet/models/section';
import { Folder } from 'app/main/followup-sheet/models/folder';
import { RequestParameter } from 'app/main/followup-sheet/models/requestParameter';
import { Deadline } from 'app/main/followup-sheet/models/deadline';
import { Sheet } from 'app/main/followup-sheet/models/sheet';
import { FollowupSheetRecapViewModel } from 'app/main/followup-sheet/models/followupSheetRecapViewModel';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { Employee } from 'app/common/models/employee';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { Point } from './models/point';
import { AppService } from 'app/app.service';


@Injectable({
  providedIn: 'root'
})
export class FollowupSheetService implements Resolve<any>{
  private GET_FOLLOWUPSHEET_VIEWMODEL_URI = 'followupSheet/index';
  private GET_DEADLINES_URI = 'followupSheet/deadlines';
  private GET_FOLLOWUPSHEET_URI = 'followupSheet/get';
  private SUBMIT_FOLLOWUPSHEET_URI = 'followupSheet/submit';
  private CLOSE_FOLLOWUPSHEET_URI = 'followupSheet/close';

  private GET_SECTIONS_ADMIN_URI = 'followupSheet/section/admin_get';
  private GET_SECTION_URI = 'followupSheet/section/get';
  private UPDATE_SECTION_URI = 'followupSheet/section/update';
  private ADD_SIMPLE_TASK_URI = 'followupSheet/section/folder/add';
  private EDIT_SIMPLE_TASK_URI = 'followupSheet/section/folder/edit';
  private DELETE_SIMPLE_TASK_URI = 'followupSheet/section/folder/delete';

  // attachments
  private UPLOAD_ATTACHMENTS_URI = 'followupSheet/attachment/upload';
  private DOWNLOAD_ATTACHMENT_URI = 'followupSheet/attachment/download';
  private DELETE_ATTACHMENT_URI = 'followupSheet/attachment/remove';

  // recap
  private GET_LAST_RECAP_URI = 'followupSheet/last_recap';
  private GET_SHEET_RECAP_URI = 'followupSheet/recap';

  // followupsheet configuration
  private GET_EMPLOYEES_LEVELS_URI = 'followupSheet/get/employees_levels';
  private ADD_EMPLOYEE_LEVEL_URI = 'followupSheet/add/employee_level';
  private UPDATE_EMPLOYEE_LEVEL_URI = 'followupSheet/update/employee_level';

  // points
  private ADD_POINT_URI = 'followupSheet/section/folder/point/add';
  private UPDATE_POINT_URI = 'followupSheet/section/folder/point/update';
  private DELETE_POINT_URI = 'followupSheet/section/folder/point/delete';

  followupSheetViewModel: BehaviorSubject<FollowupSheetViewModel>;
  deadlines: BehaviorSubject<Deadline[]>;
  onRecapChanged: BehaviorSubject<any>;
  onEmployeesChanged: BehaviorSubject<Employee[]>;
  onEmployeeLevelsChanged: BehaviorSubject<EmployeeLevel[]>;
  onResponsiblesChanged: BehaviorSubject<Employee[]>;


  maxFileSize = 4096;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private readonly followupSheet = ModuleIdentifiers.followupSheet;
  private readonly followupSheetconfiguration = ModuleIdentifiers.followupSheetconfiguration;
  private readonly lastrecap = ModuleIdentifiers.lastrecap;
  private moduleIdentifier: string;
  private routPath: string;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.followupSheetViewModel = new BehaviorSubject(null);
    this.deadlines = new BehaviorSubject([]);
    this.onRecapChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onEmployeeLevelsChanged = new BehaviorSubject([]);
    this.onResponsiblesChanged = new BehaviorSubject([]);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routPath = route.routeConfig.path;
    if (this.routPath === 'getLastRecap') {
      this.moduleIdentifier = this.lastrecap;
    } else if (this.routPath === 'followupSheet/getSheetRecap' || this.routPath === 'FollowupSheet/GetSheetRecap') {
      this.moduleIdentifier = this.lastrecap;
    } else if (this.routPath === 'followupSheet-configuration') {
      this.moduleIdentifier = this.followupSheetconfiguration;
    } else {
      this.moduleIdentifier = this.followupSheet;
    }
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                if (this.routPath === 'getLastRecap') {
                  this.getRecap(true).then(() => {
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                } else if (this.routPath === 'followupSheet/getSheetRecap' || this.routPath === 'FollowupSheet/GetSheetRecap') {
                  this.getRecap(false, route.queryParams.g, route.queryParams.w, route.queryParams.i).then(() => {
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                } else if (this.routPath === 'followupSheet-configuration') {
                  this.getEmployeesLevels().then(() => {
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }, (err) => {
                    reject(err);
                  });
                  this.moduleIdentifier = this.followupSheetconfiguration;
                }
                else {
                  Promise.all([this.getFollowupSheetViewModel(), this.getDeadlines()]).then(() => {
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

  getFollowupSheetViewModel(): Promise<FollowupSheetViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_FOLLOWUPSHEET_VIEWMODEL_URI}`;
      this._httpClient.get<FollowupSheetViewModel>(url)
        .subscribe((followupSheetViewModel) => {
          this.followupSheetViewModel.next(followupSheetViewModel);
          resolve(followupSheetViewModel);
        }, reject);
    });
  }

  getDeadlines(): Promise<Deadline[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_DEADLINES_URI}`;
      this._httpClient.get<Deadline[]>(url)
        .subscribe((deadlines) => {
          this.deadlines.next(deadlines);
          resolve(deadlines);
        }, reject);
    });
  }

  getFollowupSheet(sheetId: number): Observable<any> {
    const url = `${BASE_URL}${this.GET_FOLLOWUPSHEET_URI}`;
    return this._httpClient.post<any>(url, sheetId);
  }

  getSectionsForAdmin(requestParameter: RequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.GET_SECTIONS_ADMIN_URI}`;
    return this._httpClient.post<any>(url, requestParameter);
  }

  getSection(employeeLevelId: number, sectionId: number): Observable<any> {
    const url = `${BASE_URL}${this.GET_SECTION_URI}?employeeLevelId=${employeeLevelId}&sectionId=${sectionId}`;
    return this._httpClient.get<any>(url);
  }

  updateSection(section: Section): Observable<Section> {
    const url = `${BASE_URL}${this.UPDATE_SECTION_URI}`;
    return this._httpClient.post<Section>(url, section);
  }

  addSimpleTask(requestParameter: RequestParameter): Observable<Folder> {
    const url = `${BASE_URL}${this.ADD_SIMPLE_TASK_URI}`;
    return this._httpClient.post<Folder>(url, requestParameter);
  }

  renameSimpleTask(folder: Folder): Observable<Folder> {
    const url = `${BASE_URL}${this.EDIT_SIMPLE_TASK_URI}`;
    return this._httpClient.post<Folder>(url, folder);
  }

  deleteSimpleTask(folder: Folder): Observable<boolean> {
    const url = `${BASE_URL}${this.DELETE_SIMPLE_TASK_URI}`;
    return this._httpClient.post<boolean>(url, folder);
  }

  submitFollowupSheet(sheet: Sheet): Observable<boolean> {
    const url = `${BASE_URL}${this.SUBMIT_FOLLOWUPSHEET_URI}`;
    return this._httpClient.post<boolean>(url, sheet);
  }

  closeFollowupSheet(sheet: Sheet): Observable<Sheet> {
    const url = `${BASE_URL}${this.CLOSE_FOLLOWUPSHEET_URI}`;
    return this._httpClient.post<Sheet>(url, sheet);
  }

  uploadAttachments(folderId: any, filesToUpload: any[]): Observable<any> {
    const url = `${BASE_URL}${this.UPLOAD_ATTACHMENTS_URI}`;
    const files = filesToUpload;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file_' + i, files[i]);
    }
    formData.append('folderId', folderId);
    return this._httpClient.post<any>(url, formData);
  }

  removeAttachment(requestParameter: RequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.DELETE_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, requestParameter);
  }

  downloadAttachment(attachmentId: number): Observable<any> {
    const url = `${BASE_URL}${this.DOWNLOAD_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, attachmentId, { responseType: 'blob' as 'json' });
  }

  getRecap(lastRecap: boolean, g?: string, w?: string, i?: string): Promise<any> {
    let uri: string;
    if (lastRecap) {
      uri = this.GET_LAST_RECAP_URI;
    } else {
      uri = `${this.GET_SHEET_RECAP_URI}?g=${g}&w=${w}&i=${i}`;
    }
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${uri}`;
      this._httpClient.get<any>(url)
        .subscribe((result) => {
          this.onRecapChanged.next(result);
          resolve(result);
        }, (err) => {
          if (err.status === 400) {
            this.onRecapChanged.next(null);
            resolve();
          }
        });
    });
  }

  // Configuration

  getEmployeesLevels(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEES_LEVELS_URI}`;
      this._httpClient.get<any>(url)
        .subscribe((result) => {
          this.onEmployeesChanged.next(result.employees);
          this.onEmployeeLevelsChanged.next(result.employeeLevels);
          this.onResponsiblesChanged.next(result.responsibles);
          resolve(result);
        }, reject);
    });
  }

  addEmployeeLevel(employeeLevel: EmployeeLevel): Observable<number> {
    const url = `${BASE_URL}${this.ADD_EMPLOYEE_LEVEL_URI}`;
    return this._httpClient.post<number>(url, employeeLevel);
  }

  updateEmployeeLevel(employeeLevel: EmployeeLevel): Observable<boolean> {
    const url = `${BASE_URL}${this.UPDATE_EMPLOYEE_LEVEL_URI}`;
    return this._httpClient.post<boolean>(url, employeeLevel);
  }

  // Points

  addPoint(point: Point): Observable<Point> {
    const url = `${BASE_URL}${this.ADD_POINT_URI}`;
    return this._httpClient.post<Point>(url, point);
  }

  updatePoint(point: Point): Observable<Point> {
    const url = `${BASE_URL}${this.UPDATE_POINT_URI}`;
    return this._httpClient.post<Point>(url, point);
  }

  deletePoint(pointId: number): Observable<Point> {
    const url = `${BASE_URL}${this.DELETE_POINT_URI}`;
    return this._httpClient.post<Point>(url, pointId);
  }

}


