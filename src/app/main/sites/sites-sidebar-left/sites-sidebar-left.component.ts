import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { fuseAnimations } from '@fuse/animations';
import { TechnicalSheetFilter } from 'app/main/technical-sheet/models/technicalSheetFilter';
import { TechnicalSheet } from 'app/main/technical-sheet/models/technicalSheet';
import { SitesService } from '../sites.service';
import { SiteType } from 'app/main/sites/models/siteType';
import { SiteFilter } from 'app/main/sites/models/siteFilter';
import { PritSiteListsParams } from 'app/main/sites/models/pritSiteListsParams';
import * as moment from 'moment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';

@Component({
  selector: 'sites-sidebar-left',
  templateUrl: './sites-sidebar-left.component.html',
  styleUrls: ['./sites-sidebar-left.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SitesSidebarLeftComponent implements OnInit {
  technicalSheetFilter: TechnicalSheetFilter;
  siteTypes: SiteType[];
  filtreListTypes: any[];
  technicalSheets: TechnicalSheet[];
  siteFilter: SiteFilter;
  typesIdentifiers: number[];
  stats: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _sitesService: SitesService,
    private _loaderService: NgxUiLoaderService,
    public commonService: CommonService) {
  }

  ngOnInit(): void {
    this._sitesService.onSiteFilterChanged.subscribe((siteFilter) => {
      this.siteFilter = siteFilter;
    });
    this._sitesService.onSiteTypesChanged.subscribe((siteTypes) => {
      this.siteTypes = siteTypes;
    });
    this._sitesService.onFiltreListTypesChanged.subscribe((filtreListTypes) => {
      this.filtreListTypes = filtreListTypes;
    });
    this._sitesService.getShortStats().subscribe((stats) => {
      this.stats = stats;
    });
    this._sitesService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getFiltredSites(): void {
    this._loaderService.start();
    this.siteFilter.startIndex = 0;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter)
      .subscribe((filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  PrintSitesLists(): void {
    this._loaderService.start();
    const parameters: PritSiteListsParams = {
      typesIdentifiers: this.typesIdentifiers
    };
    this._sitesService.printSitesLists(parameters)
      .subscribe((data) => {
        this._loaderService.stop();
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const fileName = `sites_${moment().format('DDMMYYYY')}.xlsx`;
        link.download = fileName;
        link.click();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

}






