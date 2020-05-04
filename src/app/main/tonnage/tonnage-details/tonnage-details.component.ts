import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TonnageService } from '../tonnage.service';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { TonnageDetail } from 'app/main/tonnage/models/tonnageDetail';
import { TonnageItemType } from 'app/main/tonnage/models/tonnageItemType';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { AddTonnageDetailsDialogComponent } from '../dialogs/add-tonnage-details-dialog/add-tonnage-details-dialog.component';

@Component({
  selector: 'tonnage-details',
  templateUrl: './tonnage-details.component.html',
  styleUrls: ['./tonnage-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TonnageDetailsComponent implements OnInit {
  tonnage: Tonnage;
  possiblePercentage: number[];
  tonnageItemTypes: TonnageItemType[];
  tonnageGiblets: TonnageItemType[];

  newTonnageDetails: TonnageDetail;
  newTonnageGibletDetails: TonnageDetail;
  specificCarcassAverageWeight: any;

  tonnageDetailsdisplayedColumns = ['type', 'weight', 'percentage', 'actions'];
  tonnageGibletDisplayedColumns = ['type', 'weight', 'quantity', 'totale', 'actions'];

  dialogRef: any;

  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _tonnageService: TonnageService,
    private _loaderService: NgxUiLoaderService,
    private _matDialog: MatDialog,
    private _notificationService: SharedNotificationService) {
    this.newTonnageDetails = new TonnageDetail();
    this.newTonnageGibletDetails = new TonnageDetail();
  }

  ngOnInit(): void {
    this._tonnageService.onCurrentTonnageChanged
      .subscribe((tonnage) => {
        this.tonnage = tonnage;
        this.checkSpecificCarcassAverageWeight();
      });
    this._tonnageService.onPossiblePercentage
      .subscribe((possiblePercentage) => {
        this.possiblePercentage = possiblePercentage;
        this.newTonnageDetails.percentage = this.possiblePercentage[0];
      });
    this._tonnageService.onTonnageItemTypesChanged
      .subscribe((tonnageItemTypes) => {
        this.tonnageItemTypes = tonnageItemTypes;
        this.newTonnageDetails.itemType = this.tonnageItemTypes[0];
      });
    this._tonnageService.onTonnageGibletsChanged
      .subscribe((tonnageGiblets) => {
        this.tonnageGiblets = tonnageGiblets;
        this.newTonnageGibletDetails.itemType = this.tonnageGiblets[0];
      });
    this._tonnageService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addTonnageDetail(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      const tonnageDetailsToAdd: TonnageDetail = {
        weight: this.newTonnageDetails.weight,
        percentage: this.newTonnageDetails.percentage,
        tonnageId: this.tonnage.id,
        itemType: this.newTonnageDetails.itemType,
        quantity: 1,
        isRealWeight: true
      };
      this._tonnageService.addTonnageDetail(tonnageDetailsToAdd)
        .subscribe(() => {
          this.newTonnageDetails.weight = null;
          this.refreshCurrentTonnageDetails();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  addTonnageGibletDetail(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      const tonnageGibletDetailsToAdd: TonnageDetail = {
        percentage: 100,
        tonnageId: this.tonnage.id,
        itemType: this.newTonnageGibletDetails.itemType,
        quantity: this.newTonnageGibletDetails.quantity,
        isRealWeight: false,
        lambsStrategy: false
      };
      this._tonnageService.addTonnageGibletDetail(tonnageGibletDetailsToAdd)
        .subscribe(() => {
          this.newTonnageGibletDetails.quantity = null;
          this.refreshCurrentTonnageDetails();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  addSpecificCarcass(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      const specificCarcassToAdd: TonnageDetail = {
        percentage: 100,
        tonnageId: this.tonnage.id,
        itemType: this.tonnageItemTypes[0],
        quantity: this.specificCarcassAverageWeight,
        isRealWeight: false,
        lambsStrategy: true
      };
      this._tonnageService.addTonnageGibletDetail(specificCarcassToAdd)
        .subscribe(() => {
          this.refreshCurrentTonnageDetails();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  updateTonnageDetail(tonnageDetails: TonnageDetail): void {
    if (this.habilitation.canEdit()) {
      this._loaderService.start();
      this._tonnageService.updateTonnageDetail(tonnageDetails)
        .subscribe(() => {
          this.refreshCurrentTonnageDetails();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  deleteTonnageDetail(tonnageDetails: TonnageDetail): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer Tonnage Detail',
        message: 'Voulez-vous vraiment supprimer ce tonnage détail ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          this._tonnageService.deleteTonnageDetail(tonnageDetails.id)
            .subscribe(() => {
              this.refreshCurrentTonnageDetails();
            }, (err) => {
              this._loaderService.stop();
              console.log(err);
            });
        }
      });
  }

  refreshCurrentTonnageDetails(): void {
    this._tonnageService.getTonnageDetails(this.tonnage.id)
      .subscribe((tonnageMainViewModel) => {
        this._loaderService.stop();
        this._tonnageService.onCurrentTonnageChanged.next(tonnageMainViewModel.tonnage);
        this._tonnageService.onTotalBySelectedPartnerChanged.next(tonnageMainViewModel.totalBySelectedPartner);
      });
  }

  checkSpecificCarcassAverageWeight(): void {
    if (this.tonnage) {
      const specificCarcasse = this.tonnage.details.filter((item) => {
        return !item.isRealWeight && item.itemType.isCarcass;
      });
      if (specificCarcasse != null && specificCarcasse.length > 0) {
        this.specificCarcassAverageWeight = specificCarcasse[0].quantity;
      } else {
        this.specificCarcassAverageWeight = null;
      }
    }
  }

  geTotal(weight: number, quantity: number): any {
    const total = weight * quantity;
    return total.toFixed(2);
  }

  reverseList(): void {
    this.tonnage.details = [...this.tonnage.details.reverse()];
  }

  addTonnageDetailByTotalWeightAndQuantity(): void {
    this.dialogRef = this._matDialog.open(AddTonnageDetailsDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: this.tonnage
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.refreshCurrentTonnageDetails();
        }
      });
  }

}
