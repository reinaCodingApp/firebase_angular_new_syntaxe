import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ClientsService } from '../clients.service';
import { Client } from '../models/client';

@Component({
  selector: 'clients-list',
  templateUrl: './clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  currentClient: Client;
  includeDisabledClients: boolean;

  constructor(
    private _clientsService: ClientsService) { }

  ngOnInit(): void {
    this._clientsService.onClientsChanged
      .subscribe(clients => {
        this.clients = clients;
      });
  }

  getClients(): void {
    this._clientsService.getClients(this.includeDisabledClients)
      .subscribe((clients) => {
        this._clientsService.onCurrentClientChanged.next(null);
        this._clientsService.onClientsChanged.next(clients);
      }, err => {
        console.log(err);
      });
  }

  getClientDetails(currentClient): void {
    this._clientsService.onCurrentClientChanged.next(currentClient);
    this.currentClient = currentClient;
  }

}

