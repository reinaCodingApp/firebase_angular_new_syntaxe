import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { TicketViewModel } from 'app/main/ticket/models/ticketViewModel';
import { Ticket } from 'app/main/ticket/models/ticket';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Stat } from 'app/main/ticket/models/stat';
import { TicketDepartment } from 'app/main/ticket/models/ticketDepartment';
import { Employee } from 'app/common/models/employee';
import { AdminTicket } from 'app/main/ticket/models/adminTicket';
import { PartialTicket } from 'app/main/ticket/models/partialTicket';
import { AngularFireAuth } from '@angular/fire/auth';
import { Attachment } from 'app/common/models/attachment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { Service } from './models/service';
import { take } from 'rxjs/operators';
import { PaginatedTickets } from './models/paginatedTickets';
import { DetailedAdminTicket } from './models/detailedAdminTicket';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService implements Resolve<any>{
  private GET_TICKETS_URI = 'ticket/index?department_id=1';
  private GET_PENDING_TICKETS_FOR_ADMIN_URI = 'ticket/admin-tickets/pending';
  private GET_CLOSED_TICKETS_FOR_ADMIN_URI = 'ticket/admin-tickets/closed';
  private GET_URGENT_TICKETS_FOR_ADMIN_URI = 'ticket/admin-tickets/urgent';
  private FILTER_TICKETS_FOR_ADMIN_URI = 'ticket/admin-tickets/filter';
  private SEARCH_TICKETS_FOR_ADMIN_URI = 'ticket/admin-tickets/search';
  private GET_EMPLOYEE_TICKETS_URI = 'ticket/employee-tickets';
  private GET_TICKET_DETAILS_URI = 'ticket/details';
  private ADD_TICKET_URI = 'ticket/add';
  private REFRESH_STATS_URI = 'ticket/stats/refresh';
  private CLOSE_TICKET_URI = 'ticket/close';
  private REOPEN_TICKET_URI = 'ticket/reopen';
  private SEARCH_TICKETS_FOR_ADMIN = 'ticket/search/admin';
  private RELOAD_TICKETS_FOR_ADMIN = 'ticket/reload/admin';
  private ASSIGN_TICKET_URI = 'ticket/assign';
  private UPDATE_EMERGENCY_LEVEL_TICKET_URI = 'ticket/update/emergency_level';
  private GET_TICKETS_BY_SERVICE_URI = 'ticket/service';
  private ADD_COMMENT_URI = 'ticket/comment/add';
  private UPLOAD_ATTACHMENTS_URI = 'ticket/attachment/upload';
  private DOWNLOAD_ATTACHMENT_URI = 'ticket/attachment/download';
  private SEARCH_MY_TICKETS_URI = 'ticket/search';
  private GET_SERVICES_URI = 'ticket/get_services';
  private GET_ALL_UNREAD_TICKETS_COMMENTS_URI = 'ticket/all_unread_tickets_comments';
  private UPDATE_TICKET_URGENT_URI = 'ticket/update_ticket_urgent';


  ticketViewModel: TicketViewModel;
  onTicketViewModelChanged: BehaviorSubject<TicketViewModel>;
  onCurrentDepartmentStatsChanged: BehaviorSubject<Stat[]>;
  onServicesChanged: BehaviorSubject<Service[]>;
  onTicketsChanged: BehaviorSubject<AdminTicket[] | PartialTicket[]>;
  onTicketsForAdminChanged: BehaviorSubject<PaginatedTickets>;
  onCurrentTicketDetailsChanged: BehaviorSubject<DetailedAdminTicket>;
  onCurrentUrlChanged: BehaviorSubject<string>;

  searchFilter: string;
  includeClosedTickets: boolean;
  isBackofficeMember: boolean;

  routeParams: any;
  routePath: any;
  dialogRef: any;

  maxFileSize = 4096;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.ticket;

  onTextSearchFilterChanged: BehaviorSubject<string>;
  onSearchModeChanged: BehaviorSubject<boolean>;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private _route: ActivatedRoute,
    public _matDialog: MatDialog,
    private _loaderService: NgxUiLoaderService,
    private angularFireAuth: AngularFireAuth,
    private appService: AppService) {
    this.onTicketViewModelChanged = new BehaviorSubject(null);
    this.onCurrentDepartmentStatsChanged = new BehaviorSubject([]);
    this.onServicesChanged = new BehaviorSubject([]);
    this.onTicketsChanged = new BehaviorSubject([]);
    this.onTicketsForAdminChanged = new BehaviorSubject(new PaginatedTickets());
    this.onCurrentTicketDetailsChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onCurrentUrlChanged = new BehaviorSubject('admin-tickets');
    this.onSearchModeChanged = new BehaviorSubject(null);
    this.onTextSearchFilterChanged = new BehaviorSubject('');
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    this.routePath = route.routeConfig.path;
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else if (this.routePath.indexOf('employee-tickets') !== -1 && habilitation.isAdmin()) {
                this.router.navigateByUrl('/admin-tickets');
                reject();
              } else if (this.routePath.indexOf('admin-tickets') !== -1 && !habilitation.isAdmin()) {
                this.router.navigateByUrl('/employee-tickets');
                reject();
              }
              else {
                if (route.routeConfig.path.indexOf('employee-tickets') !== -1) {
                  if (route.params.id) {
                    this.getEmployeeTicketDetails(+route.params.id).then(() => {
                      this.onHabilitationLoaded.next(habilitation);
                      resolve();
                    }, err => {
                      reject(err);
                    });
                  } else {
                    this.getEmployeeTickets().then(() => {
                      this.onHabilitationLoaded.next(habilitation);
                      resolve();
                    }, err => {
                      reject(err);
                    });
                  }
                } else if (route.routeConfig.path.indexOf('admin-tickets') !== -1) {
                  this.initDataForAdmin().then(() => {
                    let completeUrl = route.url.join('/');
                    if (this.routeParams.id) {
                      const ticketId = +this.routeParams.id;
                      this.getTicketDetails(ticketId).subscribe((currentTicket) => {
                        if (currentTicket) {
                          this.onCurrentTicketDetailsChanged.next(currentTicket);
                        }
                      });
                      completeUrl = route.url.slice(0, route.url.length - 1).join('/');
                    }
                    this.onCurrentUrlChanged.next(completeUrl);
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

  initDataForAdmin(): Promise<any> {
    return Promise.all([
      this.getTicketViewModel(),
      this.loadTickets()
    ]);
  }

  loadTickets(start: number = 0): Promise<any> {
    if (this.routePath.indexOf('pending') !== -1) {
      return this.getPendingTickets(start);
    } else if (this.routePath.indexOf('closed') !== -1) {
      return this.getClosedTickets(start);
    } else if (this.routePath.indexOf('urgent') !== -1) {
      return this.getUrgentTickets(start);
    } else if (this.routePath.indexOf('search') !== -1) {
      return this.searchTickets(this.routeParams.searchInput);
    } else if (this.routePath.indexOf('filter') !== -1) {
      return this.filterTickets(this.routeParams.serviceId, start);
    }
  }

  getTicketViewModel(): Promise<TicketViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TICKETS_URI}`;
      this._httpClient.get<TicketViewModel>(url)
        .subscribe((ticketViewModel) => {
          this.ticketViewModel = ticketViewModel;
          this.onTicketViewModelChanged.next(ticketViewModel);
          this.onCurrentDepartmentStatsChanged.next(ticketViewModel.vm.currentDepartmentStats);
          this.onServicesChanged.next(ticketViewModel.vm.services);
          this.angularFireAuth.auth.currentUser.getIdTokenResult().then(r => {
            this.isBackofficeMember = !r.claims.isGuest;
            if (this.isBackofficeMember) {
              // this.onTicketsChanged.next(ticketViewModel.vm.ticketsForAdmin);
            } else {
              // this.onTicketsChanged.next(ticketViewModel.vm.myLatestTickets);
            }
          });
          // this.isBackofficeMember = this.ticketViewModel.isBackofficeMember;
          resolve(ticketViewModel);
        }, reject);
    });
  }

  closeTicket(ticket: AdminTicket): Observable<any> {
    const url = `${BASE_URL}${this.CLOSE_TICKET_URI}`;
    return this._httpClient.post<any>(url, ticket);
  }

  reOpenTicket(ticket: AdminTicket): Observable<any> {
    const url = `${BASE_URL}${this.REOPEN_TICKET_URI}`;
    return this._httpClient.post<any>(url, ticket);
  }

  addTicket(ticket: Ticket): Observable<number> {
    const url = `${BASE_URL}${this.ADD_TICKET_URI}`;
    return this._httpClient.post<number>(url, ticket);
  }

  getTicketDetails(ticketId: number): Observable<any> {
    const url = `${BASE_URL}${this.GET_TICKET_DETAILS_URI}?ticketId=${ticketId}&fromBackOffice=true`;
    return this._httpClient.get<any>(url);
  }

  assignTicket(ticket: AdminTicket, administrator: Employee, employee: Employee, service: number, deadline: any): Observable<any> {
    const url = `${BASE_URL}${this.ASSIGN_TICKET_URI}`;
    const data = {
      ticket: ticket,
      administrator: administrator,
      employee: employee,
      service: service,
      date: deadline
    };
    return this._httpClient.post<any>(url, data);
  }

  updateEmergencyLevel(ticketId: number): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_EMERGENCY_LEVEL_TICKET_URI}`;
    return this._httpClient.post<any>(url, ticketId);
  }

  getTicketsByService(service: number, includeClosedTickets: boolean): Observable<any> {
    const url = `${BASE_URL}${this.GET_TICKETS_BY_SERVICE_URI}`;
    const data = {
      service: service,
      includeClosedTickets: includeClosedTickets
    };
    return this._httpClient.post<any>(url, data);
  }

  addComment(data: any): Observable<any> {
    const url = `${BASE_URL}${this.ADD_COMMENT_URI}`;
    return this._httpClient.post<any>(url, data);
  }

  uploadFiles(ticketId: any, commentId: any, filesToUpload: any[]): Observable<any> {
    const url = `${BASE_URL}${this.UPLOAD_ATTACHMENTS_URI}`;
    const files = filesToUpload;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file_' + i, files[i]);
    }
    formData.append('ticketId', ticketId);
    formData.append('commentId', commentId);
    return this._httpClient.post<any>(url, formData);
  }

  downloadAttachment(attachment: Attachment): Observable<any> {
    const url = `${BASE_URL}${this.DOWNLOAD_ATTACHMENT_URI}`;
    return this._httpClient.post<any>(url, attachment, { responseType: 'blob' as 'json' });
  }

  getServices(): Observable<Service[]> {
    const url = `${BASE_URL}${this.GET_SERVICES_URI}`;
    return this._httpClient.get<Service[]>(url);
  }

  getEmployeeTickets(): Promise<PartialTicket[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_EMPLOYEE_TICKETS_URI}`;
      this._httpClient.get<PartialTicket[]>(url)
        .subscribe((tickets) => {
          this.onTicketsChanged.next(tickets);
          resolve(tickets);
        }, reject);
    });
  }

  getEmployeeTicketDetails(ticketId: number): Promise<DetailedAdminTicket> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_TICKET_DETAILS_URI}?ticketId=${ticketId}&fromBackOffice=false`;
      return this._httpClient.get<DetailedAdminTicket>(url)
        .subscribe((ticket) => {
          this.onCurrentTicketDetailsChanged.next(ticket);
          resolve(ticket);
        }, reject);
    });
  }

  getPendingTickets(start: number = 0): Promise<PaginatedTickets> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_PENDING_TICKETS_FOR_ADMIN_URI}?start=${start}`;
      this._httpClient.get<PaginatedTickets>(url)
        .pipe(take(1))
        .subscribe((paginatedTickets) => {
          if (paginatedTickets.start > 0) {
            const newTickets = this.onTicketsForAdminChanged.getValue().tickets;
            newTickets.push(...paginatedTickets.tickets);
            paginatedTickets.tickets = newTickets;
          }
          this.onTicketsForAdminChanged.next(paginatedTickets);
          this.onCurrentTicketDetailsChanged.next(null);
          this.onTextSearchFilterChanged.next('');
          this.onSearchModeChanged.next(false);
          resolve(paginatedTickets);
        }, reject);
    });
  }

  getClosedTickets(start: number = 0): Promise<PaginatedTickets> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_CLOSED_TICKETS_FOR_ADMIN_URI}?start=${start}`;
      this._httpClient.get<PaginatedTickets>(url)
        .pipe(take(1))
        .subscribe((paginatedTickets) => {
          if (paginatedTickets.start > 0) {
            const newTickets = this.onTicketsForAdminChanged.getValue().tickets;
            newTickets.push(...paginatedTickets.tickets);
            paginatedTickets.tickets = newTickets;
          }
          this.onTicketsForAdminChanged.next(paginatedTickets);
          this.onCurrentTicketDetailsChanged.next(null);
          this.onTextSearchFilterChanged.next('');
          this.onSearchModeChanged.next(false);
          resolve(paginatedTickets);
        }, reject);
    });
  }

  getUrgentTickets(start: number = 0): Promise<PaginatedTickets> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_URGENT_TICKETS_FOR_ADMIN_URI}?start=${start}`;
      this._httpClient.get<PaginatedTickets>(url)
        .pipe(take(1))
        .subscribe((paginatedTickets) => {
          if (paginatedTickets.start > 0) {
            const newTickets = this.onTicketsForAdminChanged.getValue().tickets;
            newTickets.push(...paginatedTickets.tickets);
            paginatedTickets.tickets = newTickets;
          }
          this.onTicketsForAdminChanged.next(paginatedTickets);
          this.onCurrentTicketDetailsChanged.next(null);
          this.onTextSearchFilterChanged.next('');
          this.onSearchModeChanged.next(false);
          resolve(paginatedTickets);
        }, reject);
    });
  }

  filterTickets(serviceId: number, start: number = 0): Promise<PaginatedTickets> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.FILTER_TICKETS_FOR_ADMIN_URI}?serviceId=${serviceId}&start=${start}`;
      this._httpClient.get<PaginatedTickets>(url)
        .pipe(take(1))
        .subscribe((paginatedTickets) => {
          if (paginatedTickets.start > 0) {
            const newTickets = this.onTicketsForAdminChanged.getValue().tickets;
            newTickets.push(...paginatedTickets.tickets);
            paginatedTickets.tickets = newTickets;
          }
          this.onTicketsForAdminChanged.next(paginatedTickets);
          this.onCurrentTicketDetailsChanged.next(null);
          this.onSearchModeChanged.next(false);
          this.onTextSearchFilterChanged.next('');
          resolve(paginatedTickets);
        }, reject);
    });
  }

  searchTickets(searchInput: string): Promise<AdminTicket[]> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.SEARCH_TICKETS_FOR_ADMIN_URI}?searchInput=${searchInput}`;
      this._httpClient.get<AdminTicket[]>(url)
        .pipe(take(1))
        .subscribe((tickets) => {
          const paginatedTickets = new PaginatedTickets();
          paginatedTickets.tickets = tickets;
          this.onTicketsForAdminChanged.next(paginatedTickets);
          this.onCurrentTicketDetailsChanged.next(null);
          if (searchInput && searchInput.trim().length > 0) {
            this.onSearchModeChanged.next(true);
            this.onTextSearchFilterChanged.next(searchInput);
          } else {
            this.onSearchModeChanged.next(false);
            this.onTextSearchFilterChanged.next('');
          }
          resolve(tickets);
        }, reject);
    });
  }

  refreshTicketsForAdmin(ticket: any): void {
    this._loaderService.stop();
    const paginatedTickets = this.onTicketsForAdminChanged.getValue();
    const currentTicket = this.onCurrentTicketDetailsChanged.getValue();
    const foundIndex = paginatedTickets.tickets.findIndex(t => t.id === ticket.id);
    if (foundIndex > -1) {
      paginatedTickets.tickets[foundIndex] = ticket;
      if (currentTicket.id === ticket.id) {
        this.onCurrentTicketDetailsChanged.next(ticket);
      }
    }

    this.onTicketsForAdminChanged.next(JSON.parse(JSON.stringify(paginatedTickets)));
  }

  getAllUnreadTicketsAndCommentsCount(fromBackOffice: boolean): Observable<number> {
    const url = `${BASE_URL}${this.GET_ALL_UNREAD_TICKETS_COMMENTS_URI}?fromBackOffice=${fromBackOffice}`;
    return this._httpClient.get<number>(url);
  }

  updateTicketUrgent(ticketId: number): Observable<boolean> {
    const url = `${BASE_URL}${this.UPDATE_TICKET_URGENT_URI}?ticketId=${ticketId}`;
    return this._httpClient.get<boolean>(url);
  }

}
