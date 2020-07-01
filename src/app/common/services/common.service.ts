import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BASE_URL } from 'environments/environment';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Employee } from 'app/common/models/employee';
import { Department } from 'app/main/webcms/web-messages/models/department';
import { Attachment } from 'app/common/models/attachment';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'app/main/settings/models/user';
import { AccessRightsService } from 'app/main/access-rights/access-rights.service';
import { Service } from 'app/main/ticket/models/service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private GET_SITE_TYPES_URI = 'common/get_site_types';
  private GET_SITES_URI = 'common/get_sites';
  private GET_EMPLOYEES_URI = 'common/get_employees';
  private GET_EMPLOYEES_BY_DEPARTMENT_URI = 'activity/all_employees';

  constructor(
    private fuseSidebarService: FuseSidebarService,
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private accessRightsService: AccessRightsService) { }

  toggleSidebar(name): void {
    this.fuseSidebarService.getSidebar(name).toggleOpen();
  }

  closeSidebar(name): void {
    this.fuseSidebarService.getSidebar(name).close();
  }

  getEmployeesByDepartment(department: Department): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEES_BY_DEPARTMENT_URI}`;
      this.httpClient.post<Employee[]>(url, { id: department.id })
        .subscribe((employees) => {
          resolve(employees);
        }, reject);
    });
  }

  getSiteTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_SITE_TYPES_URI}`;
      this.httpClient.get<any>(url).subscribe((siteTypes) => {
        resolve(siteTypes);
      }, reject);
    });
  }

  getSites(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_SITES_URI}`;
      this.httpClient.get<any>(url).subscribe((sites) => {
        resolve(sites);
      }, reject);
    });
  }

  getEmployees(includeDisabled: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEES_URI}?includeDisabled=${includeDisabled}`;
      this.httpClient.get<any>(url).subscribe((employees) => {
        resolve(employees);
      }, reject);
    });
  }

  getPrayerHours(): Observable<any> {
    const TODAY_PRAYERS_TIMES_URI = 'https://api.pray.zone/v2/times/today.json?city=paris&scool=3';
    const silentHttpClient: HttpClient = new HttpClient(this.httpBackend);
    return silentHttpClient.get(TODAY_PRAYERS_TIMES_URI);
  }
}
