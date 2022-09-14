import { Injectable } from '@angular/core';
import { BASE_URL } from 'environments/environment';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Employee } from 'app/common/models/employee';
import { Department } from '../models/department';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessRightsService } from 'app/modules/access-rights/access-rights.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private GET_SITE_TYPES_URI = 'common/get_site_types';
  private GET_SITES_URI = 'common/get_sites';
  private GET_DEPARTMENTS_URI = 'common/get_departments';
  private GET_EMPLOYEES_URI = 'common/get_employees';
  private GET_EMPLOYEES_BY_DEPARTMENT_URI = 'activity/all_employees';

  constructor(
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private accessRightsService: AccessRightsService) { }

  toggleSidebar(name): void {
      // code deleted
  }

  closeSidebar(name): void {
      // code deleted
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

  getDepartments(onlyForActivities = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_DEPARTMENTS_URI}?onlyForActivities=${onlyForActivities}`;
      this.httpClient.get<any>(url).subscribe((departments) => {
        resolve(departments);
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
