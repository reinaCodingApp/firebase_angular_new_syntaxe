import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestParameter } from 'app/main/manage-traceability-codes/models/tequestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ManageTraceabilityCodesService implements Resolve<any>{

  private GET_CODES_URI = 'managetraceabilitycodes/filter';

  onCodesChanged: BehaviorSubject<any>;
  onrequestParameterChanged: BehaviorSubject<RequestParameter>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.codeshistory;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router
  ) {
    this.onCodesChanged = new BehaviorSubject(null);
    this.onrequestParameterChanged = new BehaviorSubject({
      startIndex: 0,
      filter: '',
      length: 10
    });
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
                this.initGetCodes(this.onrequestParameterChanged.getValue()).then(() => {
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

  initGetCodes(requestParameter: RequestParameter): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_CODES_URI}`;
      this._httpClient.post<any>(url, requestParameter)
        .subscribe((result) => {
          console.log(result);
          this.onCodesChanged.next(result);
          resolve(result);
        }, reject);
    });
  }

  getCodes(requestParameter: RequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.GET_CODES_URI}`;
    return this._httpClient.post<any>(url, requestParameter);
  }

}

