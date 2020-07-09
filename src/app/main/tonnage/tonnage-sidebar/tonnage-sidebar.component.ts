import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TonnageService } from '../tonnage.service';
import { Site } from 'app/common/models/site';
import { TonnageFilterViewModel } from 'app/main/tonnage/models/tonnageFilterViewModel';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { RequestParameter } from 'app/main/tonnage/models/requestParameter';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { Client } from '../models/client';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  partners: Client[];
  partnersForSelectedSite: Client[] = [];

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
      sites.unshift({ id: 0, name: 'Tous' });
      this.sites = sites;
      this.filtredSites = sites;
    });
    this._tonnageService.onPartnersChanged.subscribe((partners) => {
      this.partners = partners;
    });
    this._tonnageService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getTonnages(form: NgForm): void {
    if (form.valid) {
      this.tonnageFilterViewModel.startDate = moment(this.tonnageFilterViewModel.startDate).format('YYYY-MM-DD');
      this.tonnageFilterViewModel.endDate = moment(this.tonnageFilterViewModel.endDate).format('YYYY-MM-DD');
      this._tonnageService.getTonnages(this.tonnageFilterViewModel)
        .subscribe((tonnageMainViewModel) => {
          this._tonnageService.onTonnagesChanged.next(tonnageMainViewModel.tonnages);
          this._tonnageService.onTotalBySelectedPeriodChanged.next(tonnageMainViewModel.totalBySelectedPeriod);
          this._tonnageService.onCurrentTonnageChanged.next(null);
        }, (err) => {
          console.log(err);
        });
    }
  }

  exportToExcel(): void {
    this._loaderService.start();
    const requestParameter: RequestParameter = {
      siteId: this.tonnageFilterViewModel.siteId,
      partnerId: this.tonnageFilterViewModel.partnerId,
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

  getPartnersForSite(): void {
    const filteredPartners = this.partners.filter((x) => {
      return x.sites.filter((y) => y.id === this.tonnageFilterViewModel.siteId).length > 0;
    });
    this.partnersForSelectedSite = filteredPartners;
    this.tonnageFilterViewModel.partnerId = 0;
  }
}





