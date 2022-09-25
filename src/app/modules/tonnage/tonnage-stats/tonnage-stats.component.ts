import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TonnageService } from '../tonnage.service';
import { fuseAnimations } from '@fuse/animations';
import { TotalTonnageByType } from '../models/totalTonnageByType';

@Component({
  selector: 'tonnage-stats',
  templateUrl: './tonnage-stats.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TonnageStatsComponent implements OnInit {
  totalBySelectedPeriod: TotalTonnageByType[];
  totalBySelectedPartner: TotalTonnageByType[];
  totalData: TotalTonnageByType[];
  displayByPeriod: boolean;

  totaldisplayedColumns = ['animalType', 'realWeight', 'averageWeight', 'total', 'pr30', 'pr50', 'pr100'];

  constructor(private _tonnageService: TonnageService) {
    this.displayByPeriod = false;
    this.totalData = this.totalBySelectedPeriod;
  }

  ngOnInit(): void {
    this._tonnageService.onTotalBySelectedPeriodChanged
      .subscribe((totalBySelectedPeriod) => {
        this.totalBySelectedPeriod = totalBySelectedPeriod;
        this.checkDataToDisplay();
      });
    this._tonnageService.onTotalBySelectedPartnerChanged
      .subscribe((totalBySelectedPartner) => {
        this.totalBySelectedPartner = totalBySelectedPartner;
        this.checkDataToDisplay();
      });
  }

  onDisplayStatsChanged(value: boolean): void {
    this.displayByPeriod = value;
    this.checkDataToDisplay();
  }

  checkDataToDisplay(): void {
    if (this.displayByPeriod) {
      if (this.totalBySelectedPartner != null) {
        this.totalData = this.totalBySelectedPartner;
      } else {
        this.totalData = [];
      }
    } else {
      if (this.totalBySelectedPeriod != null) {
        this.totalData = this.totalBySelectedPeriod;
      } else {
        this.totalData = [];
      }
    }
  }

}
