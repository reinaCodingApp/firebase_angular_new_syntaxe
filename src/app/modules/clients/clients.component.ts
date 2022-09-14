import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/services/common.service';
import { ClientsService } from './clients.service';
import { AddClientDialogComponent } from './dialogs/add-client-dialog/add-client-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Client } from './models/client';
import { Habilitation } from '../access-rights/models/habilitation';

@Component({
  selector: 'clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  currentClient: Client;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public commonService: CommonService,
    private _clientsService: ClientsService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._clientsService.onCurrentClientChanged
      .subscribe(currentClient => {
        if (!currentClient) {
          this.currentClient = null;
        }
        else {
          this.currentClient = currentClient;
        }
      });
    this._clientsService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addClient(): void {
    this.dialogRef = this._matDialog.open(AddClientDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'new'
      }
    });
  }

}


