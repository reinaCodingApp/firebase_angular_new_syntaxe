import { Component, OnInit, ViewEncapsulation, HostBinding, Input } from '@angular/core';
import { AddTonnageDialogComponent } from '../../dialogs/add-tonnage-dialog/add-tonnage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TonnageService } from '../../tonnage.service';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { Tonnage } from '../../models/tonnage';

@Component({
  selector: 'tonnage-item',
  templateUrl: './tonnage-item.component.html'
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
