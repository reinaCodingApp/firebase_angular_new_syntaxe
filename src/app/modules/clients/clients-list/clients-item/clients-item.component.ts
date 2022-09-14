import { Component, OnInit, ViewEncapsulation, HostBinding, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { ClientsService } from '../../clients.service';
import { AddClientDialogComponent } from '../../dialogs/add-client-dialog/add-client-dialog.component';
import { Client } from '../../models/client';

@Component({
  selector: 'clients-item',
  templateUrl: './clients-item.component.html'
})
export class ClientsItemComponent implements OnInit {
  @Input() client: Client;
  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  @HostBinding('class.selected')
  selected: boolean;

  constructor(
    private _matDialog: MatDialog,
    private _clientsService: ClientsService,
  ) { }

  ngOnInit(): void {
    this._clientsService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  updateClient(client: Client): void {
    const updatedClient = JSON.parse(JSON.stringify(client));
    this.dialogRef = this._matDialog.open(AddClientDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        client: updatedClient
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }
}

