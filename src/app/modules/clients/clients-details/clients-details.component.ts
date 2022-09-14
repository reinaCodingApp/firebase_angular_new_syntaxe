import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { ClientsService } from '../clients.service';
import { Site } from 'app/common/models/site';
import { Client } from '../models/client';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { ClientSiteViewModel } from '../models/clientSiteViewModel';

@Component({
  selector: 'clients-details',
  templateUrl: './clients-details.component.html'
})
export class ClientsDetailsComponent implements OnInit {
  client: Client;
  sites: Site[] = [];
  selectedSite: number;
  displayedColumns = ['name', 'city', 'zipCode', 'actions'];
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _clientsService: ClientsService,
    private _notificationService: SharedNotificationService) {
  }

  ngOnInit(): void {
    this._clientsService.onCurrentClientChanged
      .subscribe((client) => {
        this.sites = this._clientsService.onSitesChanged.getValue();
        this.client = client;
        if (this.client !== null) {
          this.selectedSite = this.sites[0].id;
        }
      });
    this._clientsService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addSiteToClient(): void {
    if (!this.siteAlreadyExist()) {
      const clientSiteViewModel: ClientSiteViewModel = {
        clientId: this.client.id,
        siteId: this.selectedSite
      };
      this._clientsService.addSiteToClient(clientSiteViewModel)
        .subscribe((clientUpdated) => {
          this._clientsService.refreshClient(clientUpdated);
          this._notificationService.showSuccess('site ajouté avec succés');
        }, (err) => {
          console.log(err);
          this._notificationService.showStandarError();
        });
    }
  }

  removeSiteFromClient(site: Site): void {
    const clientSiteViewModel: ClientSiteViewModel = {
      clientId: this.client.id,
      siteId: site.id
    };
    this._clientsService.removeSiteFromClient(clientSiteViewModel)
      .subscribe((clientUpdated) => {
        this._clientsService.refreshClient(clientUpdated);
        this._notificationService.showSuccess('site supprimé avec succés');
      }, (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      });
  }

  siteAlreadyExist(): boolean {
    let result = false;
    for (const site of this.client.sites) {
      if (site.id === this.selectedSite) {
        result = true;
        break;
      }
    }
    return result;
  }

}


