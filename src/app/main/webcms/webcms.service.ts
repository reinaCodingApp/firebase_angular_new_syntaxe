import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { BASE_URL } from 'environments/environment';
import { Discussion } from 'app/main/webcms/models/discussion';
import { DiscussionItem } from 'app/main/webcms/models/discussionItem';
import { Attachment } from 'app/common/models/attachment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { Location } from '@angular/common';
import { Department } from 'app/common/models/department';
import { filter } from 'minimatch';
import { take } from 'rxjs/operators';
import { PaginatedDiscussions } from './models/paginatedDiscussions';
import { AppService } from 'app/app.service';


@Injectable({
  providedIn: 'root'
})
export class WebcmsService implements Resolve<any>
{
  private GET_OPEN_DISCUSSIONS_URI = 'webcms/discussions/open';
  private GET_CLOSED_DISCUSSIONS_URI = 'webcms/discussions/closed';
  private SEARCH_DISCUSSION_URI = 'webcms/discussions/search';
  private FILTER_DISCUSSIONS_URI = 'webcms/discussions/filter';
  private GET_DISCUSSION_DETAILS_URI = 'webcms/discussion';
  private POST_DISCUSSION_ITEM_URI = 'webcms/discussion_item/add';
  private CLOSE_DISCUSSION_URI = 'webcms/discussion/close';
  private GET_COUNTERS_URI = 'webcms/discussions/backoffice_counters';
  private DOWNLOAD_ATTACHMENT_URI = 'webcms/discussion/attachment/download';
  private GET_DEPARTMENTS_URI = 'webcms/departments';

  discussions: Discussion[];
  currentDiscussion: Discussion;
  searchText = '';
  counters: any;

  onDiscussionsChanged: BehaviorSubject<PaginatedDiscussions>;
  onCurrentDiscussionChanged: BehaviorSubject<any>;
  onCountersChanged: BehaviorSubject<any>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onCurrentUrlChanged: BehaviorSubject<string>;

  onSearchModeChanged: BehaviorSubject<boolean>;
  onTextSearchFilterChanged: BehaviorSubject<string>;
  routeParams: any;
  routePath: any;
  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.webmessages;
  departments: Department[] = null;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private _route: ActivatedRoute,
    private appService: AppService,
    private location: Location
  ) {
    this.onDiscussionsChanged = new BehaviorSubject(new PaginatedDiscussions());
    this.onCurrentDiscussionChanged = new BehaviorSubject(null);
    this.onCountersChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onCurrentUrlChanged = new BehaviorSubject('webcms');
    this.onSearchModeChanged = new BehaviorSubject(null);
    this.onTextSearchFilterChanged = new BehaviorSubject('');
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routePath = route.routeConfig.path;
    this.routeParams = route.params;
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
                  let completeUrl = route.url.join('/');
                  if (this.routeParams.id) {
                    const discussionId = +this.routeParams.id;
                    this.getDiscussionDetails(discussionId);
                    completeUrl = route.url.slice(0, route.url.length - 1).join('/');
                  }
                  this.onCurrentUrlChanged.next(completeUrl);
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
      this.getDepartments(),
      this.getCounters(),
      this.loadMessages()
    ]);
  }

  loadMessages(start: number = 0): Promise<any> {
    if (this.routePath.indexOf('discussions') !== -1) {
      return this.getOpenDiscussions(false, start);
    } else if (this.routePath.indexOf('frauds') !== -1) {
      return this.getOpenDiscussions(true, start);
    } else if (this.routePath.indexOf('closed') !== -1) {
      return this.getClosedDiscussions(start);
    } else if (this.routePath.indexOf('search') !== -1) {
      return this.searchDiscussions(this.routeParams.searchInput);
    } else if (this.routePath.indexOf('filter') !== -1) {
      return this.filterDiscussions(this.routeParams.departmentId, start);
    }
  }

  getOpenDiscussions(fraud = false, start: number = 0): Promise<PaginatedDiscussions> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_OPEN_DISCUSSIONS_URI}?fraud=${fraud}&start=${start}`;
      this._httpClient.get<PaginatedDiscussions>(url)
        .pipe(take(1))
        .subscribe((paginatedDiscussions) => {
          if (paginatedDiscussions.start > 0) {
            const newDisuccions = this.onDiscussionsChanged.getValue().discussions;
            newDisuccions.push(...paginatedDiscussions.discussions);
            paginatedDiscussions.discussions = newDisuccions;
          }
          this.onDiscussionsChanged.next(paginatedDiscussions);
          this.onCurrentDiscussionChanged.next(null);
          this.onTextSearchFilterChanged.next('');
          this.onSearchModeChanged.next(false);
          resolve(paginatedDiscussions);
        }, reject);
    });
  }

  getClosedDiscussions(start: number = 0): Promise<PaginatedDiscussions> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_CLOSED_DISCUSSIONS_URI}?start=${start}`;
      this._httpClient.get<PaginatedDiscussions>(url)
      .pipe(take(1))
        .subscribe((paginatedDiscussions) => {
          if (paginatedDiscussions.start > 0) {
            const newDisuccions = this.onDiscussionsChanged.getValue().discussions;
            newDisuccions.push(...paginatedDiscussions.discussions);
            paginatedDiscussions.discussions = newDisuccions;
          }
          this.onDiscussionsChanged.next(paginatedDiscussions);
          this.onCurrentDiscussionChanged.next(null);
          this.onTextSearchFilterChanged.next('');
          this.onSearchModeChanged.next(false);
          resolve(paginatedDiscussions);
        }, reject);
    });
  }

  searchDiscussions(searchInput: string): Promise<Discussion[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.SEARCH_DISCUSSION_URI}?searchInput=${searchInput}`;
      this._httpClient.get<Discussion[]>(url)
      .pipe(take(1))
        .subscribe((discussions) => {
          this.discussions = discussions;
          const paginatedDiscussion = new PaginatedDiscussions();
          paginatedDiscussion.discussions = discussions;
          this.onDiscussionsChanged.next(paginatedDiscussion);
          this.onCurrentDiscussionChanged.next(null);
          if (searchInput && searchInput.trim().length > 0) {
            this.onSearchModeChanged.next(true);
            this.onTextSearchFilterChanged.next(searchInput);
          } else {
            this.onSearchModeChanged.next(false);
            this.onTextSearchFilterChanged.next('');
          }
          resolve(this.discussions);
        }, reject);
    });
  }

  filterDiscussions(departmentId: number, start: number = 0): Promise<PaginatedDiscussions> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.FILTER_DISCUSSIONS_URI}?departmentId=${departmentId}&start=${start}`;
      this._httpClient.get<PaginatedDiscussions>(url)
      .pipe(take(1))
        .subscribe((paginatedDiscussions) => {
          // this.discussions = discussions;
          if (paginatedDiscussions.start > 0) {
            const newDisuccions = this.onDiscussionsChanged.getValue().discussions;
            newDisuccions.push(...paginatedDiscussions.discussions);
            paginatedDiscussions.discussions = newDisuccions;
          }
          this.onDiscussionsChanged.next(paginatedDiscussions);
          this.onCurrentDiscussionChanged.next(null);
          this.onSearchModeChanged.next(false);
          this.onTextSearchFilterChanged.next('');
          resolve(paginatedDiscussions);
        }, reject);
    });
  }

  getDiscussionDetails(id: number): Promise<Discussion> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_DISCUSSION_DETAILS_URI}?id=${id}`;
      this._httpClient.get<Discussion>(url)
      .pipe(take(1))
        .subscribe((currentDiscussion) => {
          if (currentDiscussion) {
            this.onCurrentDiscussionChanged.next(currentDiscussion);
          }
          resolve(currentDiscussion);
        }, () => {
          reject();
        });
    });
  }

  closeDiscussion(uid: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.CLOSE_DISCUSSION_URI}?id=${id}&uid=${uid}`;
      this._httpClient.get<boolean>(url)
        .subscribe((result) => {
          resolve(result);
        }, reject);
    });
  }

  getCounters(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_COUNTERS_URI}`;
      this._httpClient.get<any>(url)
        .subscribe((counters) => {
          this.counters = counters;
          this.onCountersChanged.next(this.counters);
          resolve(counters);
        }, reject);
    });
  }

  addDiscussionItem(discussionItem: DiscussionItem): Observable<any> {
      const url = `${BASE_URL}${this.POST_DISCUSSION_ITEM_URI}`;
      return this._httpClient.post<any>(url, discussionItem);
  }

  downloadAttachment(attachment: Attachment): Observable<any> {
    const url = `${BASE_URL}${this.DOWNLOAD_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, attachment, { responseType: 'blob' as 'json' });
  }
  getDepartments(): Promise<Department[]> {
    if (this.departments && this.departments.length > 0) {
      return Promise.resolve(this.departments);
    }
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_DEPARTMENTS_URI}`;
      this._httpClient.get<Department[]>(url)
        .subscribe((departments) => {
          this.departments = departments;
          this.onDepartmentsChanged.next(this.departments);
          resolve(this.departments);
        }, reject);
    });
  }

}
