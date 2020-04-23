import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Client } from 'app/main/clients/models/client';
import { ClientsService } from '../../clients.service';

@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddClientDialogComponent implements OnInit {
  client: Client;
  clients: Client[];

  constructor(
    public matDialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _clientsService: ClientsService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.client = data.client;
    } else {
      this.client = new Client();
    }
  }

  ngOnInit(): void {
    this._clientsService.onClientsChanged.subscribe((clients) => {
      this.clients = clients;
    });
  }

  addClient(): void {
    this._loaderService.start();
    this._clientsService.addClient(this.client).subscribe((createdClient) => {
      this.clients.push(createdClient);
      this._clientsService.onClientsChanged.next(this.clients);
      this.matDialogRef.close();
      this._notificationService.showSuccess('Partenaire crée avec succés');
      this._loaderService.stop();
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
      this._loaderService.stop();
    });
  }

  updateClient(): void {
    this._loaderService.start();
    this._clientsService.updateClient(this.client).subscribe((response) => {
      if (response) {
        const clientIndex = this.clients.findIndex(c => c.id === this.client.id);
        if (clientIndex >= 0) {
          this.clients[clientIndex] = this.client;
          this._clientsService.onClientsChanged.next(this.clients);
        }
      }
      this.matDialogRef.close();
      this._notificationService.showSuccess('Partenaire modifié avec succés');
      this._loaderService.stop();
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
      this._loaderService.stop();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateClient();
      } else {
        this.addClient();
      }
    }
  }

}



