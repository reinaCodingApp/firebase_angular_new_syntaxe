import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ClientsService } from '../clients.service';
import { Client } from 'app/main/clients/models/client';


@Component({
  selector: 'clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  currentClient: Client;

  constructor(
    private _clientsService: ClientsService,
    private _loaderService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._clientsService.onClientsChanged
      .subscribe(clients => {
        this.clients = clients;
      });
  }

  getClientDetails(currentClient): void {
    this._clientsService.onCurrentClientChanged.next(currentClient);
    this.currentClient = currentClient;
  }

}

