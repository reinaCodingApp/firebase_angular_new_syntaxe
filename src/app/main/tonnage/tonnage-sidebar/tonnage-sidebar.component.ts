import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { TonnageService } from '../tonnage.service';
import { Site } from 'app/common/models/site';
import { TonnageFilterViewModel } from 'app/main/tonnage/models/tonnageFilterViewModel';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { RequestParameter } from 'app/main/tonnage/models/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';

@Component({
  selector: 'tonnage-sidebar',
  templateUrl: './tonnage-sidebar.component.html',
  styleUrls: ['./tonnage-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TonnageSidebarComponent implements OnInit {
  tonnageFilterViewModel: TonnageFilterViewModel;
  sites: Site[];
  filtredSites: Site[];
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _tonnageService: TonnageService,
    private _loaderService: NgxUiLoaderService,
    public commonService: CommonService) {
  }

  ngOnInit(): void {
    this._tonnageService.onTonnageFilterViewModelChanged.subscribe((tonnageFilterViewModel) => {
      this.tonnageFilterViewModel = tonnageFilterViewModel;
    });
    this._tonnageService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
      this.filtredSites = sites;
    });
    this._tonnageService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getTonnages(form: NgForm): void {
    if (form.valid) {
      this._loaderService.start();
      this.tonnageFilterViewModel.startDate = moment(this.tonnageFilterViewModel.startDate).format('YYYY-MM-DD');
      this.tonnageFilterViewModel.endDate = moment(this.tonnageFilterViewModel.endDate).format('YYYY-MM-DD');
      this._tonnageService.getTonnages(this.tonnageFilterViewModel)
        .subscribe((tonnageMainViewModel) => {
          this._tonnageService.onTonnagesChanged.next(tonnageMainViewModel.tonnages);
          this._tonnageService.onTotalBySelectedPeriodChanged.next(tonnageMainViewModel.totalBySelectedPeriod);
          this._tonnageService.onCurrentTonnageChanged.next(null);
          this._loaderService.stop();
        }, (err) => {
          this._loaderService.stop();
          console.log(err);
        });
    }
  }

  exportToExcel(): void {
    this._loaderService.start();
    const requestParameter: RequestParameter = {
      siteId: this.tonnageFilterViewModel.siteId,
      startDate: moment(this.tonnageFilterViewModel.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.tonnageFilterViewModel.endDate).format('YYYY-MM-DD')
    };
    this._tonnageService.generateStatsForSite(requestParameter)
      .subscribe((data) => {
        this._loaderService.stop();
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const fileName = `tonnage_${moment(requestParameter.endDate).format('DDMMYYYY')}.xlsx`;
        link.download = fileName;
        link.click();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  searchSite(searchInput): void {
    if (!this.sites) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredSites = this.sites.filter(s => s.name.toLowerCase().indexOf(searchInput) > -1);
  }
}





