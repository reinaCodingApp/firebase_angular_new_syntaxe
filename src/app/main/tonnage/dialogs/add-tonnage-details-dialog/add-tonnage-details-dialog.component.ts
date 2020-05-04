import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TonnageDetail } from '../../models/tonnageDetail';
import { TonnageService } from '../../tonnage.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tonnage } from '../../models/tonnage';
import { TonnageItemType } from '../../models/tonnageItemType';

@Component({
  selector: 'app-add-tonnage-details-dialog',
  templateUrl: './add-tonnage-details-dialog.component.html',
  styleUrls: ['./add-tonnage-details-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTonnageDetailsDialogComponent implements OnInit {
  tonnage: Tonnage;
  newTonnageDetails: TonnageDetail;
  tonnageItemTypes: TonnageItemType[];
  possiblePercentage: number[];

  constructor(
    public matDialogRef: MatDialogRef<AddTonnageDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _tonnageService: TonnageService,
    private _notificationService: SharedNotificationService
  ) {
    this.tonnage = data;
    this.newTonnageDetails = new TonnageDetail();
  }

  ngOnInit(): void {
    this._tonnageService.onTonnageItemTypesChanged
      .subscribe((tonnageItemTypes) => {
        this.tonnageItemTypes = tonnageItemTypes;
        this.newTonnageDetails.itemType = this.tonnageItemTypes[0];
      });
    this._tonnageService.onPossiblePercentage
      .subscribe((possiblePercentage) => {
        this.possiblePercentage = possiblePercentage;
        this.newTonnageDetails.percentage = this.possiblePercentage[0];
      });
  }

  addTonnageDetailByTotalWeight(form: NgForm): void {
    if (form.valid && this.isValidatedValues()) {
      this._loaderService.start();
      const tonnageDetailsToAdd: TonnageDetail = {
        weight: this.newTonnageDetails.weight,
        percentage: this.newTonnageDetails.percentage,
        tonnageId: this.tonnage.id,
        itemType: this.newTonnageDetails.itemType,
        quantity: this.newTonnageDetails.quantity,
        isRealWeight: true
      };
      this._tonnageService.addTonnageDetailByTotalWeightAndQuantity(tonnageDetailsToAdd)
        .subscribe((result) => {
          this._loaderService.stop();
          this.matDialogRef.close(true);
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  isValidatedValues(): boolean {
    return this.newTonnageDetails.quantity > 0 && this.newTonnageDetails.weight > 0 &&
      this.newTonnageDetails.quantity < this.newTonnageDetails.weight;
  }

}
