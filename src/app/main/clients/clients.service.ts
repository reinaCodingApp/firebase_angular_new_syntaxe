import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { Site } from 'app/common/models/site';
import { Client } from 'app/main/clients/models/client';
import { ClientSiteViewModel } from 'app/main/clients/models/clientSiteViewModel';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements Resolve<any>
{
  private GET_CLIENTS_VIEWMODEL_URI = 'clients/index';
  private ADD_CLIENT_URI = 'clients/add';
  private UPDATE_CLIENT_URI = 'clients/update';
  private ADD_SITE_TO_CLIENT_URI = 'clients/add_site';
  private REMOVE_SITE_FROM_CLIENT_URI = 'clients/remove_site';

  onClientsChanged: BehaviorSubject<Client[]>;
  onSitesChanged: BehaviorSubject<Site[]>;
  onCurrentClientChanged: BehaviorSubject<Client>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.clients;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private appService: AppService
  ) {
    this.onCurrentClientChanged = new BehaviorSubject(null);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onClientsChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                this.getClientsViewModel().then(() => {
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

  getClientsViewModel(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_CLIENTS_VIEWMODEL_URI}`;
      this._httpClient.get<any>(url).subscribe((ClientsViewModel) => {
        this.onClientsChanged.next(ClientsViewModel.partners);
        this.onSitesChanged.next(ClientsViewModel.sites);
        resolve();
      }, reject);
    });
  }

  addClient(client: Client): Observable<Client> {
    const url = `${BASE_URL}${this.ADD_CLIENT_URI}`;
    return this._httpClient.post<Client>(url, client);
  }

  updateClient(client: Client): Observable<Client> {
    const url = `${BASE_URL}${this.UPDATE_CLIENT_URI}`;
    return this._httpClient.post<Client>(url, client);
  }

  addSiteToClient(clientSiteViewModel: ClientSiteViewModel): Observable<Client> {
    const url = `${BASE_URL}${this.ADD_SITE_TO_CLIENT_URI}`;
    return this._httpClient.post<Client>(url, clientSiteViewModel);
  }

  removeSiteFromClient(clientSiteViewModel: ClientSiteViewModel): Observable<Client> {
    const url = `${BASE_URL}${this.REMOVE_SITE_FROM_CLIENT_URI}`;
    return this._httpClient.post<Client>(url, clientSiteViewModel);
  }

  refreshClient(client: Client): void {
    const clients = this.onClientsChanged.getValue();
    const clientIndex = clients.findIndex(c => c.id === client.id);
    if (clientIndex >= 0) {
      clients[clientIndex] = client;
      this.onClientsChanged.next(clients);
      this.onCurrentClientChanged.next(client);
    }
  }
}
