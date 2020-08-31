import { Component, OnInit, ViewEncapsulation, HostBinding, Input } from '@angular/core';
import { AddTonnageDialogComponent } from '../../dialogs/add-tonnage-dialog/add-tonnage-dialog.component';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TonnageService } from '../../tonnage.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'tonnage-item',
  templateUrl: './tonnage-item.component.html',
  styleUrls: ['./tonnage-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TonnageItemComponent implements OnInit {
  @Input() tonnage: Tonnage;
  @Input() currentTonnage: Tonnage;
  private dialogRef: any;

  @HostBinding('class.selected')
  selected: boolean;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _matDialog: MatDialog,
    private _loaderService: NgxUiLoaderService,
    private _tonnageService: TonnageService,
  ) { }

  ngOnInit(): void {
    this._tonnageService.onCurrentTonnageChanged.subscribe(tonnage => {
      this.currentTonnage = tonnage;
    });
    this._tonnageService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  updateTonnage(tonnage: Tonnage): void {
    const updatedTonnage = JSON.parse(JSON.stringify(tonnage));
    this.dialogRef = this._matDialog.open(AddTonnageDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: 'edit',
        tonnage: updatedTonnage
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(() => {
      });
  }

  deleteTonnage(tonnage: Tonnage): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer Tonnage',
        message: 'Voulez-vous vraiment supprimer ce tonnage ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._tonnageService.deleteTonnage(tonnage.id)
            .subscribe(() => {
              if (this.currentTonnage) {
                if (this.currentTonnage.id === tonnage.id) {
                  this._tonnageService.onCurrentTonnageChanged.next(null);
                }
              }
              this._tonnageService.refreshData();
            }, (err) => {
              console.log(err);
              this._loaderService.stop();
            });
        }
      });
  }

  validateTonnage(): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Valider tonnage',
        message: 'Voulez-vous valider ce tonnage ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._tonnageService.validateTonnage(this.tonnage).subscribe((result) => {
            if (result) {
              this._tonnageService.onCurrentTonnageChanged.next(null);
              this._tonnageService.refreshData();
            }
            console.log(result);
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

  openTonnage(): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Ouvrir tonnage',
        message: 'Voulez-vous ouvrir ce tonnage ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._tonnageService.openTonnage(this.tonnage).subscribe((result) => {
            if (result) {
              this._tonnageService.onCurrentTonnageChanged.next(null);
              this._tonnageService.refreshData();
            }
            console.log(result);
          }, (err) => {
            console.log(err);
          });
        }
      });
  }

}
