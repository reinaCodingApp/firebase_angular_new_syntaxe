import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Tonnage } from '../models/tonnage';
import { TonnageService } from '../tonnage.service';
@Component({
  selector: 'tonnage-list',
  templateUrl: './tonnage-list.component.html'
})
export class TonnageListComponent implements OnInit {
  tonnages: Tonnage[] = [];
  currentTonnage: Tonnage;

  constructor(private _tonnageService: TonnageService) { }

  ngOnInit(): void {
    this._tonnageService.onTonnagesChanged
      .subscribe(tonnages => {
        this.tonnages = tonnages;
      });
  }

  getTonnageDetails(currentTonnage): void {
    this._tonnageService.getTonnageDetails(currentTonnage.id)
      .subscribe((tonnageMainViewModel) => {
        this._tonnageService.onCurrentTonnageChanged.next(tonnageMainViewModel.tonnage);
        this._tonnageService.onTotalBySelectedPartnerChanged.next(tonnageMainViewModel.totalBySelectedPartner);
        this.currentTonnage = tonnageMainViewModel.tonnage;
      }, (err) => {
        console.log(err);
      });
  }

}

