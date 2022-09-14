import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';

import { ClientsService } from '../../clients.service';
import { Client } from '../../models/client';

@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html'
})
export class AddClientDialogComponent implements OnInit {
  client: Client;
  clients: Client[];

  constructor(
    public matDialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _clientsService: ClientsService,
    private _notificationService: SharedNotificationService
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
    this._clientsService.addClient(this.client).subscribe((createdClient) => {
      this.clients.push(createdClient);
      this._clientsService.onClientsChanged.next(this.clients);
      this.matDialogRef.close();
      this._notificationService.showSuccess('Partenaire crée avec succés');
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  updateClient(): void {
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
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
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



