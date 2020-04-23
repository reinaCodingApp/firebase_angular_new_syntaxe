import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TonnageService } from '../tonnage.service';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'tonnage-list',
  templateUrl: './tonnage-list.component.html',
  styleUrls: ['./tonnage-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TonnageListComponent implements OnInit {
  tonnages: Tonnage[] = [];
  currentTonnage: Tonnage;

  constructor(
    private _tonnageService: TonnageService,
    private _loaderService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._tonnageService.onTonnagesChanged
      .subscribe(tonnages => {
        this.tonnages = tonnages;
      });
  }

  getTonnageDetails(currentTonnage): void {
    this._loaderService.start();
    this._tonnageService.getTonnageDetails(currentTonnage.id)
      .subscribe((tonnageMainViewModel) => {
        this._tonnageService.onCurrentTonnageChanged.next(tonnageMainViewModel.tonnage);
        this._tonnageService.onTotalBySelectedPartnerChanged.next(tonnageMainViewModel.totalBySelectedPartner);
        this.currentTonnage = tonnageMainViewModel.tonnage;
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

}

